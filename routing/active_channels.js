/* Returns active channels

  channels: <Local LND channels Array>

  @returns
    channels: <Local LND channels Array>
*/
module.exports = channels => {
  return channels.filter(channel => channel.is_active);
};
