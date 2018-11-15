const { getChannels } = require('../lnd');
// return local channel data
module.exports = async chanId => {
  const chansData = await getChannels();
  let channel = null;
  for (let c of chansData.channels) {
    if (c.id === chanId) {
      channel = c;
      break;
    }
  }
  return channel;
};
