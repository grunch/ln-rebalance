const { getLocalChannel } = require('../routing');

module.exports = channelId => {
  if (typeof channelId === 'undefined') {
    console.log('You need to enter the channel id');
    process.exit(0);
  }
  getLocalChannel(channelId)
    .then(channel => {
      if (channel) {
        console.log(channel);
      } else {
        console.log("Channel not found");
      }
    })
    .catch(err => console.log(err));
};
