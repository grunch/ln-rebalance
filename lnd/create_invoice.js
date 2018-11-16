const createInvoice = require('../ln-service/createInvoice');

const daemon = require('./daemon');

/** Get node info

  @returns via cbk
  {

  }
*/
module.exports = async ({ tokens }) => {
  let lnd;

  try {
    lnd = daemon();
  } catch (e) {
    console.log(e);
  }

  return await createInvoice({ tokens, lnd });
};
