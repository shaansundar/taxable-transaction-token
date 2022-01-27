const { expect } = require("chai");


describe("TaxableTX Tests", function () {
  
  let owner,addr1,addr2,escrow;
  let deployedTaxableTX
  beforeEach(async function () {
    [owner, addr1, addr2, escrow] = await ethers.getSigners();
    const TaxableTX = await ethers.getContractFactory("TaxableTx");
    deployedTaxableTX = await TaxableTX.deploy(owner.address, escrow.address, 1000, "NewTax", "NTX");
    // const deployedTaxableTX = await deployedTaxableTX.deployed();
  });
  
  it("Should assign the total supply of tokens to the owner", async function () {
    const ownerBalance = await deployedTaxableTX.balanceOf(owner.address);
    expect(await deployedTaxableTX.totalSupply()).to.equal(ownerBalance);
  });
  
  it("Should transfer from wallet 1 to 2 with fee taken away", async function(){
    let init_addr1 = await deployedTaxableTX.balanceOf(addr1.address)
    let init_addr2 = await deployedTaxableTX.balanceOf(addr2.address)
    let init_escrow = await deployedTaxableTX.balanceOf(escrow.address)
    

    await deployedTaxableTX.transfer(addr1.address, 50);
    const addr1Balance = await deployedTaxableTX.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(45);


    await deployedTaxableTX.connect(addr1).transfer(addr2.address, 20);
    const addr2Balance = await deployedTaxableTX.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(18);
    const escrowBalance = await deployedTaxableTX.balanceOf(escrow.address);
    expect(escrowBalance).to.equal(5+2)

    // Transfer 50 tokens from owner to addr1

    // Transfer 50 tokens from addr1 to addr2
    // We use .connect(signer) to send a transaction from another account

  })

  // it("Should fail if sender doesn’t have enough tokens", async function () {
  //   const initialOwnerBalance = await deployedTaxableTX.balanceOf(owner.address);

  //   // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
  //   // `require` will evaluate false and revert the transaction.
  //   await expect(
  //     deployedTaxableTX.connect(addr1).transfer(owner.address, 1)
  //   ).to.be.revertedWith("Not enough tokens");

  //   // Owner balance shouldn't have changed.
  //   expect(await deployedTaxableTX.balanceOf(owner.address)).to.equal(
  //     initialOwnerBalance
  //   );
  // });

  describe("Run Through",function(){
    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await deployedTaxableTX.balanceOf(owner.address);
      const initialEscrowBalance = await deployedTaxableTX.balanceOf(escrow.address);
      let tx1 = 100, tx2 = 50;
      // Transfer 100 tokens from owner to addr1.
      await deployedTaxableTX.transfer(addr1.address, tx1);

      // Transfer another 50 tokens from owner to addr2.
      await deployedTaxableTX.transfer(addr2.address, tx2);

      // Check balances.
      const finalOwnerBalance = await deployedTaxableTX.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));
      
      const finalEscrowBalance = await deployedTaxableTX.balanceOf(escrow.address);
      expect(finalEscrowBalance).to.equal(tx1*0.1+tx2*0.1);

      const addr1Balance = await deployedTaxableTX.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(tx1*0.9);

      const addr2Balance = await deployedTaxableTX.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(tx2*0.9);
    });
  });

  // it("Should return the new greeting once it's changed", async function () {
  //   const Greeter = await ethers.getContractFactory("Greeter");
  //   const greeter = await Greeter.deploy("Hello, world!");
  //   await greeter.deployed();

  //   expect(await greeter.greet()).to.equal("Hello, world!");

  //   const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

  //   // wait until the transaction is mined
  //   await setGreetingTx.wait();

  //   expect(await greeter.greet()).to.equal("Hola, mundo!");
  // });
});
