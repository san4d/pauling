# Pauling
Creating a strong bond between Ethereum and the XRPL

## Goal
Create a bidirectional bridge between Ethereum and the XRPL such that Ethereum tokens can be automatically issued on the XRPL and subsequently redeemed back on the Etherium blockchain.

## Motivation
DeFi trading is expensive in the Ethereum ecosystem. Between gas and fees, small-value trades are impractical. Transactions on the XRPL are fast and cheap, and its DEX provides a decentralized mechanism for trading XRP and other issued currecies; however, there are currently no flushed out DeFi applications utilizing the XRPL. If Ethereum-based tokens could be represented on the XRPL and traded on its DEX, users could have the benefits of both ecosystems.

## Approach
Create contract on Ethereum that
1. Receives tokens into a deposit wallet
2. Records the type of token, the amount, and the desired destination address on the XRPL
3. Publishes an event that indicates a transfer was been requested
4. Publishes an event that indicates a transfer has been completed, included the corresponding ledger index on the XRPL 
5. Allows the contract owner to withdraw tokens from the deposit wallets to a specified Ethereum address

Create a service that interacts with the Ethereum blockchain and the XRPL that
1. Listens form transfer requested events on Ethereum
2. Creates an issued currency corresponding to the deposited token on the XRPL
3. Sends the issued currency to the destination wallet
4. Listends for withdrawl requests by monitoring transactions to a withdrawl wallets on the XRPL
5. Triggers the withdrawl on Ethereum and destroys the issued currency