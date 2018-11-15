const { getNetworkInfo } = require('../lnd');

module.exports = async _ => {
  const res = await getNetworkInfo();
  console.log(res);
};
