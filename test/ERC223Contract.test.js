const { advanceBlock } = require('openzeppelin-solidity/test/helpers/advanceToBlock');
const { EVMRevert } = require('openzeppelin-solidity/test/helpers/EVMRevert');

require('chai')
  .use(require('chai-as-promised'))
  .should();

const ERC223Contract = artifacts.require('ERC223Contract');
const ERC223TokenMock = artifacts.require('ERC223TokenMock');

contract('ERC223Contract', function (accounts) {
  const value = 42;

  let contract;
  let token;

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await advanceBlock();

    contract = await ERC223Contract.new();
    token = await ERC223TokenMock.new(accounts[0], 1000, { from: accounts[0] });
  });

  it('should revert tokenFallback', async function () {
    await token.transfer(contract.address, value, { from: accounts[0] }).should.be.rejectedWith(EVMRevert);
  });
});
