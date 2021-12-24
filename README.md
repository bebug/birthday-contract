# birthday-contract

Solidity contract to be used with a ERC20 token. This contract will restrict the withdrawal until a certain date is reached. Contract can only be used for one token address, but several deposits for multiple adresses and partial withdrawals are possible.

## Usage
* Provide ERC20 token address during deployment.
* Approve desired allowence from ERC20 token.
* Call depositToken() with the token amount (without decimals), the timestamp (epoch in seconds) and the receiver address.
* After the date is reached the receiver can call withdrawToken() to get the tokens transferred to his address.
* To get all deposits for an address call totalBalanceOf(address).
* To get the next withdrawal date call nextWithdrawal(address, timestamp).

## Remarks
There is no possibility to withdraw tokens earlier! Tokens with a wrong address or timestamp (in milliseconds for example) will be lost forever!
