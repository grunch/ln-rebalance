const getRoutes = require('./get_routes');
const getChannel = require('./get_channel');
const getChannels = require('./get_channels');
const getNetworkInfo = require('./get_network_info');
const payment = require('./payment');
const getInfo = require('./get_info');
const createInvoice = require('./create_invoice');

module.exports = {
  getChannels,
  getNetworkInfo,
  getRoutes,
  getChannel,
  payment,
  getInfo,
  createInvoice,
};
