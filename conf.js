// default final CLTV delta
const finalCLTVDelta = 9;

// maximum token allowed payment currently permitted by LND
const maxPaymentTokens = 4294967;

// used to decide which channels can be sources or destinations (groups A or B)
const FIXED_PERCENT = 50;
const MARGIN = 5;

module.exports = { finalCLTVDelta, maxPaymentTokens, FIXED_PERCENT, MARGIN };
