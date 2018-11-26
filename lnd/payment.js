const pay = require('ln-service/pay');

const daemon = require('./daemon');

/** Get routes to a node

  @returns via cbk
  {

  }
*/
module.exports = async ({ path }) => {
  let lnd;

  try {
    lnd = daemon();
  } catch (e) {
    console.log(e);
  }

  return await pay({ path, lnd });
};
