const { getChannel } = require('../lnd');
const { computeFee } = require('./fee');

/* Converts Millitokens to tokens
  amt: <Millitokens amount Number>

  @returns
  <Tokens amount Number>
*/
const mSatToSat = amt => {
  return Math.floor(amt / 1000);
};

/* Recalculates amount, cltv and fees for routing path given with new params

  {
    routes: [{
      fee: <Total Fee Tokens To Pay Number>
      fee_mtokens: <Total Fee Millitokens To Pay String>
      hops: [{
        channel_capacity: <Channel Capacity Tokens Number>
        channel_id: <Unique Channel Id String>
        fee: <Fee Number>
        fee_mtokens: <Fee Millitokens String>
        forward: <Forward Tokens Number>
        forward_mtokens: <Forward Millitokens String>
        [public_key]: <Public Key Hex String>
        timeout: <Timeout Block Height Number>
      }]
    }]
    currentHeight: <Current block height Number>
    amtToSend: <Amount of Millitokens to send>
    finalCLTVDelta: <CLTV Timeout Blocks Delta Number>
  }

  @returns
  {
    routes: [{
      fee: <Total Fee Tokens To Pay Number>
      fee_mtokens: <Total Fee Millitokens To Pay String>
      hops: [{
        channel_capacity: <Channel Capacity Tokens Number>
        channel_id: <Unique Channel Id String>
        fee: <Fee Number>
        fee_mtokens: <Fee Millitokens String>
        forward: <Forward Tokens Number>
        forward_mtokens: <Forward Millitokens String>
        [public_key]: <Public Key Hex String>
        timeout: <Timeout Block Height Number>
      }]
    }]
  }
*/
const recalculatePath = ({ route, currentHeight, amtToSend, finalCLTVDelta }) => {
  let totalTimeLock = currentHeight;
  let nextIncomingAmount = 0;
  let hops = [];
  const pathLength = route.hops.length;
  for (let i = pathLength - 1; i >= 0; i--) {
    const edge = route.edges[i];
    let amtToForward = amtToSend;
    let fee = 0;
    let feeMsat = 0;
    if (i != pathLength - 1) {
      amtToForward = nextIncomingAmount;
      fee = computeFee(amtToForward, route.edges[i+1]);
    }
    let outgoingTimeLock = 0;
    if (i == pathLength - 1) {
      totalTimeLock += finalCLTVDelta;

      outgoingTimeLock = currentHeight + finalCLTVDelta;
    } else {
      delta = route.edges[i+1].cltv_delta;
      totalTimeLock += delta;

      outgoingTimeLock = totalTimeLock - delta;
    }

    const currentHop = {
      channel_capacity: route.hops[i].channel_capacity,
      channel_id: route.hops[i].channel_id,
      fee: mSatToSat(fee),
      fee_mtokens: fee.toString(),
      forward: mSatToSat(amtToForward),
      forward_mtokens: amtToForward.toString(),
      timeout: outgoingTimeLock,
      public_key: route.hops[i].public_key,
    };
    hops.unshift(currentHop);
    nextIncomingAmount = amtToForward + fee;
  }
  const totalFees = nextIncomingAmount - parseInt(hops[hops.length-1].forward_mtokens);
  route.fee = mSatToSat(totalFees);
  route.fee_mtokens = totalFees;
  route.timeout = totalTimeLock;
  route.tokens = mSatToSat(nextIncomingAmount);
  route.mtokens = nextIncomingAmount;
  route.hops = hops;

  return route;
};

/* Gets channel policies of origin edges

  {
    routes: [{
      fee: <Total Fee Tokens To Pay Number>
      fee_mtokens: <Total Fee Millitokens To Pay String>
      hops: [{
        channel_capacity: <Channel Capacity Tokens Number>
        channel_id: <Unique Channel Id String>
        fee: <Fee Number>
        fee_mtokens: <Fee Millitokens String>
        forward: <Forward Tokens Number>
        forward_mtokens: <Forward Millitokens String>
        [public_key]: <Public Key Hex String>
        timeout: <Timeout Block Height Number>
      }]
    }]
  }

  @returns
  {
    routes: [{
      fee: <Total Fee Tokens To Pay Number>
      fee_mtokens: <Total Fee Millitokens To Pay String>
      hops: [{
        channel_capacity: <Channel Capacity Tokens Number>
        channel_id: <Unique Channel Id String>
        fee: <Fee Number>
        fee_mtokens: <Fee Millitokens String>
        forward: <Forward Tokens Number>
        forward_mtokens: <Forward Millitokens String>
        [public_key]: <Public Key Hex String>
        timeout: <Timeout Block Height Number>
      }]
      edges: [{
        base_fee_mtokens: <Base Routing Fee In Millitokens Number>
        cltv_delta: <CLTV Blocks Delta Number>
        fee_rate: <Fee Rate In Millitokens Per Million Number>
        public_key_from: <Edge Public Key Hex String>
      }]
    }]
  }
*/
const getEdges = async route => {
  let edges = [];
  for (let hop of route.hops) {
    const { policies } = await getChannel({ id: hop.channel_id });
    for (let edge of policies) {
      // we need to get data from the origin edge
      if (edge.public_key !== hop.public_key) {
        const e = {
          base_fee_mtokens: edge.base_fee_mtokens,
          cltv_delta: edge.cltv_delta,
          fee_rate: edge.fee_rate,
          public_key_from: edge.public_key,
        };
        edges.push(e);
      }
    }
  }
  route.edges = edges;

  return route;
};

/* Adds last hop to route

  {
    routes: [{
      fee: <Total Fee Tokens To Pay Number>
      fee_mtokens: <Total Fee Millitokens To Pay String>
      hops: [{
        channel_capacity: <Channel Capacity Tokens Number>
        channel_id: <Unique Channel Id String>
        fee: <Fee Number>
        fee_mtokens: <Fee Millitokens String>
        forward: <Forward Tokens Number>
        forward_mtokens: <Forward Millitokens String>
        [public_key]: <Public Key Hex String>
        timeout: <Timeout Block Height Number>
      }]
    }]
    channel_capacity: <Channel Capacity Tokens Number>
    channel_id: <Channel Id String>
    tokens: <Tokens Number>
    mtokens <Millitokens String>
    public_key: <Public Key Hex String>
  }
*/
const addLastHopsToRoutes = ({
  routes,
  channel_capacity,
  channel_id,
  tokens,
  mtokens,
  public_key,
}) => {
  let newRoutes = [];
  for (let route of routes) {
    const newLastHop = {
      channel_capacity,
      channel_id,
      fee: 0,
      fee_mtokens: '0',
      forward: tokens,
      forward_mtokens: mtokens.toString(),
      timeout: 0,
      public_key,
    };
    const hops = [...route.hops, newLastHop];
    route.hops = hops;
    newRoutes.push(route);
  }

  return newRoutes;
};

module.exports = { recalculatePath, getEdges, addLastHopsToRoutes };
