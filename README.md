# LN Rebalance

## Overview
Routing on lighting is complicated because when a node creates the possible routes to send a payment, it know the funding capacity of the channels, but it doesn't know if those channels still have funds or if it has funds in which side of the channel they are, so there are  posibilities of failure that increases while the amount to send increment.

let's see an example:

    A (100 sats) <===capacity 100=====> B (0 sats)
    A (100 sats) <===capacity 100=====> C (0 sats)
    A (100 sats) <===capacity 100=====> D (0 sats)
    A (100 sats) <===capacity 100=====> E (0 sats)
    A (0 sats)   <===capacity 300=====> F (300 sats)

If you check your channel balance is 400 sats, but you can't send a payment for more than 100 sats, we can manage this issue rebalancing our channels a little bit, we can start to take funds from one channel to another in order to have balance in our bigger 300 sats capacity channel, after rebalance we will have the channels this way (we ignore fees for the sake of simplicity)

    A (50 sats)  <===capacity 100=====> B (50 sats)
    A (50 sats)  <===capacity 100=====> C (50 sats)
    A (50 sats)  <===capacity 100=====> D (50 sats)
    A (100 sats) <===capacity 100=====> E (0 sats)
    A (150 sats) <===capacity 300=====> F (150 sats)

This way we can take advantage of our bigger channel and route payments through it.

This tool are NodeJS scripts for channel rebalancing on LND, this is an experimental project, it is NOT recommended for mainnet use, we are not responsible for any trouble this software can cause, please be careful.

For the moment this service only works on a command line, for this need to work you need to setup your own [lightning network node](https://dev.lightning.community/).

## Requirements
This has been tested on:
    lnd version 0.5.0-beta commit=v0.5-beta-321-gd4b042dc1946ece8b60d538ade8e912f035612fe
    node v10.13.0

## Installation Instructions

    git clone https://github.com/grunch/ln-rebalance.git
    cd ln-rebalance
    npm install

You need the tls.cert and admin.macaroon files to achieve authentication on your LND node, if you have your LND running locally, you should have this files on `~/.lnd` directory, but you can indicate other directory in case you need with the environment variables.

### Configuring Environment Variables
Environment variables:

    export GRPC_SSL_CIPHER_SUITES="HIGH+ECDSA"
    export LNSERVICE_LND_DIR="/home/user/.lnd"
    export LNSERVICE_CHAIN="bitcoin"
    export LNSERVICE_NETWORK="testnet"
    export LND_GRPC_PORT="10009"
    export LND_HOST="1.1.1.1"

For convenience, you can make a `.env` file with KEY=VALUE pairs instead of setting environment variables, take a look on `.env-sample` file.

## Running LN-rebalance
    $ bin/cli # to see the options

## Testing
Regrettably, TBD
