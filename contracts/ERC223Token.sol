pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/BasicToken.sol";
import "./ERC223Contract.sol";
import "./ERC223Lib.sol";


// implements ERC223
// see: https://github.com/ethereum/EIPs/issues/223
contract ERC223Token is ERC223Contract, BasicToken {

  event Transfer(address indexed from, address indexed to, uint256 value, bytes data);

  function transfer(address _to, uint256 _value, bytes _data) public returns (bool success) {
    super.transfer(_to, _value); // BasicToken

    emit Transfer(msg.sender, _to, _value, _data);

    if (ERC223Lib.isContract(_to)) {
      ERC223ContractInterface(_to).tokenFallback(msg.sender, _value, _data);
    }

    return true;
  }

  // ERC223 compatible transfer function (2-arg, for backwards compatibility)
  function transfer(address _to, uint256 _value) public returns (bool success) {
    bytes memory empty;

    return transfer(_to, _value, empty);
  }
}
