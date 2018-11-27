const activeChannels = require('./active_channels');
const { FIXED_PERCENT, MARGIN } = require('../conf');

/*
  Divides channels in two groups:
  A group: remote balance < FIXED_PERCENT % - MARGIN %
           local balance  > FIXED_PERCENT % + MARGIN %
  B group: remote balance > FIXED_PERCENT % + MARGIN %
           local balance  < FIXED_PERCENT % - MARGIN %

  {
    channels: <Local LND channels Array>
  }

  @returns
  {
    a: <Source channels Array>
    b: <Destination channels Array>
  }
*/
module.exports = channels => {
  // we only work with active channels
  const actives = activeChannels(channels);
  const aGroup = [];
  const bGroup = [];
  actives.forEach(channel => {
    const remoteBalancePercent = channel.remote_balance * 100 / channel.capacity;
    const localBalancePercent = channel.local_balance * 100 / channel.capacity;
    if (remoteBalancePercent < (FIXED_PERCENT - MARGIN)
        && localBalancePercent > (FIXED_PERCENT + MARGIN)) {
      aGroup.push(channel);
    } else if (localBalancePercent < (FIXED_PERCENT - MARGIN)
              && remoteBalancePercent > (FIXED_PERCENT + MARGIN)) {
      bGroup.push(channel);
    }
  });

  return { a: aGroup, b: bGroup };
};
