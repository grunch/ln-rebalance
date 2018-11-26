const { getLocalChannel } = require('../routing');

module.exports = channelId => {
  if (typeof channelId === 'undefined') {
    console.log('You need to enter the channel id');
    process.exit(1);
  }
  try {
    const channel = getLocalChannel(channelId);
    if (channel) {
      console.log(channel);
    } else {
      console.log("Channel not found");
    }
  } catch (e) {
    console.log(e);
  }
};
