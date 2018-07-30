pragma solidity ^0.4.24;

import "../ERC223Lib.sol";


contract LibMock {

  function isContract(address addr) public view returns (bool) {
    return ERC223Lib.isContract(addr);
  }

}
