const groupChannels = require('./group_channels');
const { maxPaymentTokens } = require('../conf');
/* Get routing query

  {
    channels: <Local LND channels Array>
    sourceChannelId: <Source channel Id String>
    destChannelId: <Destination channel Id String>
  }

  @returns
  {
    dest_public_key: <Destination node public key String>
    dest_channel_id: <Destination node channel Id String>
    dest_channel_capacity: <Destination node public key String>
    tokens: <Amount of tokens to be send Number>
    mtokens: <Amount of Millitokens to be send String>
    source_channel_id: <Source node public key String>
    source_public_key: <Source node public key String>
  }
*/
module.exports = ({ channels, sourceChannelId, destChannelId }) => {
  if (!destChannelId) {
    console.log('Destination channel id is required');
    return false;
  }

  // we group them:
  // A group: remote balance < PERCENT - margin. sourceChannel
  // B group: local balance < PERCENT - margin. destChannel
  const group = groupChannels(channels);
  let destChannel = {};
  for (let b of group.b) {
    if (b.id === destChannelId) {
      destChannel = b;
      break;
    }
  }

  if (typeof destChannel.partner_public_key === 'undefined') {
    console.log('Destination channel not found');
    process.exit(0);
  }
  let query = null;
  let sourceChannel = { id: '', partner_public_key: '' };
  if (sourceChannelId) {
    for (let a of group.a) {
      if (a.id === sourceChannelId) {
        sourceChannel = a;
        break;
      }
    }
  }

  if (typeof sourceChannel.partner_public_key === 'undefined') {
    console.log('Source channel not found');
    process.exit(0);
  }

  // we calculate the rebalance amount from our A group channel
  let canSendTokens = 0;
  if (sourceChannelId) {
    canSendTokens = ((sourceChannel.local_balance + sourceChannel.remote_balance) / 2) - sourceChannel.remote_balance;
  }
  const canRecvTokens = ((destChannel.local_balance + destChannel.remote_balance) / 2) - destChannel.local_balance;
  let tokens = canSendTokens;
  if (canSendTokens > canRecvTokens || !sourceChannelId) {
    tokens = canRecvTokens;
  }
  tokens = Math.round(tokens);
  if (tokens > maxPaymentTokens) {
    tokens = maxPaymentTokens;
  }

  const mtokens = tokens * 1000;

  query = {
    dest_public_key: destChannel.partner_public_key,
    dest_channel_id: destChannel.id,
    dest_channel_capacity: destChannel.capacity,
    tokens,
    mtokens,
    source_channel_id: sourceChannel.id,
    source_public_key: sourceChannel.partner_public_key,
  };

  return query;
};
