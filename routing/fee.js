module.exports = (amt, edge) => {
  return Math.floor(parseInt(edge.base_fee_mtokens) + (amt * edge.fee_rate / 1000000));
};
