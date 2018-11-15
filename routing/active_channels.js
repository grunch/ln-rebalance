// return active channels
module.exports = channels => {
  return channels.filter(channel => channel.is_active);
};
