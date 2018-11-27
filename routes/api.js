const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { getNetworkInfo, getChannels } = require('../lnd');
const { groupChannels, getLocalChannel } = require('../routing');

router.use(bodyParser.json());

router.get('/get_ln_info', async (req, res, next) => {
  try {
    const info = await getNetworkInfo();

    return res.status(200).json(info);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
});

router.get('/get_src_channels', async (req, res, next) => {
  try {
    const channelsData = await getChannels();
    const group = groupChannels(channelsData.channels);

    return res.status(200).json(group.a);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
});

router.get('/get_dst_channels', async (req, res, next) => {
  try {
    const channelsData = await getChannels();
    const group = groupChannels(channelsData.channels);

    return res.status(200).json(group.b);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
});

router.get('/get_local_channel', async (req, res, next) => {
  if (typeof req.query.channel_id === 'undefined') {
    return res.status(500).json({
      message: 'The channel id is required',
    });
  }
  try {
    const channel = await getLocalChannel(req.query.channel_id);
    if (channel) {
      return res.status(200).json(group.b);
    }
    return res.status(500).json({
      message: 'Channel not found',
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
});

module.exports = router;
