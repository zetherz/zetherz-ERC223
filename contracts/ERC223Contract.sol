pragma solidity ^0.4.24;


contract/* interface */ ERC223ContractInterface {
  function tokenFallback(address _from, uint256 _value, bytes _data) external;
}


// implements ERC223
// see: https://github.com/ethereum/EIPs/issues/223
contract ERC223Contract is ERC223ContractInterface {

  // Reject all ERC223 compatible tokens
  // --- param names commented out to prevent 'Unused function parameter' compilation warnings ---
  function tokenFallback(address /*_from*/, uint256 /*_value*/, bytes /*_data*/) external {
    revert("tokenFallback rejection");
  }

}
