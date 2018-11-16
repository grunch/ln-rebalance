const getChannels = require('../ln-service/getChannels');

const daemon = require('./daemon');

/** Get node info

  @returns via cbk
  {

  }
*/
module.exports = async _ => {
  let lnd;

  try {
    lnd = daemon();
  } catch (e) {
    console.log(e);
  }

  return await getChannels({ lnd });
};
