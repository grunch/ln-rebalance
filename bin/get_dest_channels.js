const { getChannels } = require('../lnd');
const { groupChannels } = require('../routing');

module.exports = async _ => {
  try {
    const channelsData = await getChannels();
    const group = groupChannels(channelsData.channels);
    console.log('Destination channels:', group.b);
  } catch (e) {
    console.log(e);
  }
};
