/*
  Computes the fee to forward an HTLC of amt millitokens over
  the passed active payment channel. This value is currently computed as
  specified in BOLT07, but will likely change in the near future.

  (
    amt <Millitokens amount Number>
    edge <Edge policies>:
    {
      base_fee_mtokens: <Base Fee Millitokens String>
      cltv_delta: <Locktime Delta Number>
      fee_rate: <Fees Charged Per Million Tokens Number>
      public_key_from: <Node Public Key String>
    }
  )

  @returns
  fee: <Fee Millitokens Number>

*/
const computeFee = (amt, edge) => {
  return Math.floor(parseInt(edge.base_fee_mtokens) + (amt * edge.fee_rate / 1000000));
};

module.exports = { computeFee };
