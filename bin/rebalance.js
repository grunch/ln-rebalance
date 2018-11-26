const { getChannels, getRoutes, payment, getInfo, createInvoice } = require('../lnd');
const {
  getQuery,
  groupChannels,
  recalculatePath,
  getEdges,
  addLastHopsToRoutes,
} = require('../routing');
const { finalCLTVDelta } = require('../conf');

module.exports = async options => {
  if(typeof options.dst_channel_id === 'undefined') {
    console.log('Destination channel Id is required');
    process.exit(0);
  }

  try {
    const { current_block_height, public_key } = await getInfo();
    const { channels } = await getChannels();
    const query = getQuery({
      channels,
      sourceChannelId: options.src_channel_id,
      destChannelId: options.dst_channel_id,
    });
    if (options.amount) {
      const amt = parseInt(options.amount);
      query.tokens = amt;
      query.mtokens = amt * 1000;
    }

    if (!!query) {
      const { id } = await createInvoice({ tokens: query.tokens });
      console.log('Finding path to destination...');
      let { routes } = await getRoutes({
        public_key: query.dest_public_key,
        tokens: query.tokens,
      });
      // if any, we remove those routes where destination channel is the first hop
      routes = routes.filter(route => { // pendiente si es necesario quitar esto ya
        return route.hops[0].channel_id !== query.dest_channel_id
      });
      let aRoutes = [];
      // if the user indicates source channel
      if (typeof options.src_channel_id !== 'undefined') {
        // we get only the routes where the first hop is the source
        routes = routes.filter(route => {
          return route.hops[0].channel_id === options.src_channel_id
        });
      } else {
        // we use only routes from 'a' group
        const grouped = groupChannels(channels);
        for (let route of routes) {
          for (let channel of grouped.a) {
            if (route.hops[0].channel_id === channel.id) {
              aRoutes.push(route);
            }
          }
        }
      }

      const lhRoutes = addLastHopsToRoutes({
        routes,
        channel_capacity: query.dest_channel_capacity,
        channel_id: query.dest_channel_id,
        tokens: query.tokens,
        mtokens: query.mtokens,
        public_key,
      });
      let newRoutes = [];
      for (let route of lhRoutes) {
        const withEdge = await getEdges(route);
        const newPath = recalculatePath({
          route: withEdge,
          currentHeight: parseInt(current_block_height),
          amtToSend: query.mtokens,
          finalCLTVDelta,
        });
        newRoutes.push(newPath);
      }
      // finally we create the payment path
      const path = {
        id,
        routes: newRoutes,
      }
      console.log('Sending payment...')
      const pay = await payment({ path });
      if (pay.is_confirmed) {
        console.log('Channel rebalanced!');
        console.log(pay);
        process.exit(0);
      }
    }
  } catch (e) {
    console.log(e);
  }
};
