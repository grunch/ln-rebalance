const getNetworkInfo = require('../ln-service/getNetworkInfo');

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

  return await getNetworkInfo({ lnd });
};
