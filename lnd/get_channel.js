const getChannel = require('../ln-service/getChannel');

const daemon = require('./daemon');

/** Get routes to a node

  @returns via cbk
  {

  }
*/
module.exports = async ({ id }) => {
  let lnd;

  try {
    lnd = daemon();
  } catch (e) {
    console.log(e);
  }

  return await getChannel({ id, lnd });
};
