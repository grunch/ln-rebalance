const { getNetworkInfo } = require('../lnd');

module.exports = async _ => {
  try {
    const res = await getNetworkInfo();
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
