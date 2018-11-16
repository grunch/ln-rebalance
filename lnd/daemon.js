const { localLnd } = require('../ln-service');

let lnd;

/** Get LND connection

  {}

  @throws
  <Error> when necessary environment variables are missing;

  @returns
  <LND Object>
*/
module.exports = _ => {
  // Exit early when LND connection is cached
  if (!!lnd) {
    return lnd;
  }

  lnd = localLnd({});

  return lnd;
};
