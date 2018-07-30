const { advanceBlock } = require('openzeppelin-solidity/test/helpers/advanceToBlock');
const { EVMRevert } = require('openzeppelin-solidity/test/helpers/EVMRevert');

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const ERC223TokenMock = artifacts.require('ERC223TokenMock');
const LibMock = artifacts.require('LibMock');

function checkEventLogs (logs, eventName, args) {
  var argsNum = Object.keys(args).length;
  var event = logs.find(e => (e.event === eventName) && (Object.keys(e.args).length === argsNum));
  should.exist(event);
  for (var prop in args) {
    if (args[prop] === null) {
      continue;
    }
    if (args.hasOwnProperty(prop)) {
      if (event.args[prop] instanceof BigNumber) {
        event.args[prop].should.be.bignumber.equal(args[prop]);
      } else {
        event.args[prop].should.equal(args[prop]);
      }
    }
  }
}

contract('ERC223Token', function ([_, owner, wallet, thirdparty]) {
  const value = 42;
  const dataEmpty = '0x';
  const dataCustom = '1337';

  let token;

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await advanceBlock();

    token = await ERC223TokenMock.new(owner, 1000, { from: owner });
  });

  describe('should transfer to non-contract address', async function () {
    it('should transfer (3-arg)', async function () {
      const { logs } = await token.transfer3(thirdparty, value, dataCustom, { from: owner });
      checkEventLogs(logs, 'Transfer', { from: owner, to: thirdparty, value: value }); // BasicToken
      checkEventLogs(logs, 'Transfer',
        { from: owner, to: thirdparty, value: value, data: /* dataCustom */null }); // ERC223Token
    });

    it('should transfer (2-arg)', async function () {
      const { logs } = await token.transfer(thirdparty, value, { from: owner });
      checkEventLogs(logs, 'Transfer', { from: owner, to: thirdparty, value: value }); // BasicToken
      checkEventLogs(logs, 'Transfer', { from: owner, to: thirdparty, value: value, data: dataEmpty }); // ERC223Token
    });
  });

  describe('should transfer to ERC223 contract address w/ tokenFallback overload', async function () {
    let contract;

    before(async function () {
      contract = await ERC223TokenMock.new(owner, 1000, { from: owner });
    });

    it('should transfer (3-arg)', async function () {
      const { logs } = await token.transfer3(contract.address, value, dataCustom, { from: owner });
      checkEventLogs(logs, 'Transfer', { from: owner, to: contract.address, value: value }); // BasicToken
      checkEventLogs(logs, 'Transfer',
        { from: owner, to: contract.address, value: value, data: /* dataCustom */null }); // ERC223Token
    });

    it('should transfer (2-arg)', async function () {
      const { logs } = await token.transfer(contract.address, value, { from: owner });
      checkEventLogs(logs, 'Transfer', { from: owner, to: contract.address, value: value }); // BasicToken
      checkEventLogs(logs, 'Transfer',
        { from: owner, to: contract.address, value: value, data: dataEmpty }); // ERC223Token
    });
  });

  describe('should not transfer to contract address w/o tokenFallback', async function () {
    let contract;

    before(async function () {
      contract = await LibMock.new();
    });

    it('should not transfer (3-arg)', async function () {
      await token.transfer3(contract.address, value, dataCustom, { from: owner }).should.be.rejectedWith(EVMRevert);
    });

    it('should not transfer (2-arg)', async function () {
      await token.transfer(contract.address, value, { from: owner }).should.be.rejectedWith(EVMRevert);
    });
  });
});
