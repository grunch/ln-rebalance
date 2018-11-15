const getRoutes = require('ln-service/getRoutes');

const daemon = require('./daemon');

/** Get routes to a node

  @returns via cbk
  {

  }
*/
module.exports = async ({ public_key, tokens, finalCLTVDelta }) => {
  let lnd;
  let final_cltv_delta = 9;
  try {
    if (!public_key) {
      throw new Error("Public key is needed");
    }

    if (!tokens) {
      throw new Error("Tokens are needed");
    }

    if (finalCLTVDelta) {
      final_cltv_delta = finalCLTVDelta;
    }

    lnd = daemon();
  } catch (e) {
    console.log(e);
  }

  return getRoutes({ destination: public_key, lnd, tokens, final_cltv_delta });
};
