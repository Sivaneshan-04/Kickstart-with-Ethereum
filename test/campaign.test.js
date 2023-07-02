const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const compileFactory = require("../ethereum/build/CampaignFactory.json");
const compileCampaign = require("../ethereum/build/Campaign.json");

let accounts, factory, campaignAddress, campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compileFactory.interface))
    .deploy({ data: compileFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(compileCampaign.interface),
    campaignAddress
  );
});

describe("Campaign", () => {
  it("Deploys the contract", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("caller is the manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("allows poeple to contibute and checks for approver", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });

    const isContributer = await campaign.methods.approvers(accounts[1]).call();

    assert(isContributer);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "200",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Successful in making a request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    const request = await campaign.methods.requests(0).call();

    assert.equal("Buy batteries", request.description);
  });

  it("Completes request", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest(
        "Buy Batteries",
        web3.utils.toWei("5", "ether"),
        accounts[1]
      )
      .send({
        from: accounts[0],
        gas: "1000000",
      });


      let balance = await web3.eth.getBalance(accounts[1]);
      balance = web3.utils.fromWei(balance,'ether');

      console.log(balance);

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });
    
    balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance,'ether');
    balance = parseFloat(balance);
    console.log(balance);

    assert(balance>103);
  });

});
