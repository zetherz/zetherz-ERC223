pragma solidity ^0.4.24;

import "../ERC223Token.sol";


contract ERC223TokenMock is ERC223Token {

  constructor(address initialAccount, uint256 initialBalance) public {
    balances[initialAccount] = initialBalance;
    totalSupply_ = initialBalance;
  }

  // Accept ERC223 compatible tokens!
  function tokenFallback(address /*_from*/, uint256 /*_value*/, bytes /*_data*/) external {
  }

  // Necessary due to web3 bug where overloaded function calls are broken
  function transfer3(address _to, uint256 _value, bytes _data) public returns (bool success) {
    return transfer(_to, _value, _data);
  }

}
