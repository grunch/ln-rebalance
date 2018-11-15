# LN Rebalance

## Overview
NodeJS script for channel rebalancing on LND, this is an experimental project, it is NOT recommended for mainnet use, we are not responsible for any trouble this software can cause, please be careful.

For the moment this service only works on a command line, for this need to work you need to setup your own lightning network node.

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
