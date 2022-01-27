const { expect } = require("chai");


describe("TaxableTX Tests", function () {
  
  let owner,addr1,addr2,escrow;
  let deployedTaxableTX
  beforeEach(async function () {
    [owner, addr1, addr2, escrow] = await ethers.getSigners();
    const TaxableTX = await ethers.getContractFactory("TaxableTx");
    deployedTaxableTX = await TaxableTX.deploy(owner.address, escrow.address, 1000, 10 ,"NewTax", "NTX");
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

  it("Should allow owner to send tokens from wallet1 to wallet2", async function () {
    await deployedTaxableTX.transfer(addr1.address, 50);
    const addr1Balance = await deployedTaxableTX.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(45);
    
    await deployedTaxableTX.transfer(addr2.address, 10);
    const addr2Balance = await deployedTaxableTX.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(9);
    
    const initialAllowance = await deployedTaxableTX.allowance(addr1.address, owner.address);
    expect(initialAllowance).to.equal(0);
    
    await deployedTaxableTX.connect(addr1).approve(owner.address, 100);
    
    const finalAllowance = await deployedTaxableTX.allowance(addr1.address, owner.address);
    expect(finalAllowance).to.equal(100);
    
    await deployedTaxableTX.transferFrom(addr1.address, addr2.address, 20)
    
    const finalAllowance2 = await deployedTaxableTX.allowance(addr1.address, owner.address);
    expect(finalAllowance2).to.equal(80);
    const finalAddr2Balance = await deployedTaxableTX.balanceOf(addr2.address);
    expect(finalAddr2Balance).to.equal(9+18);
    const finalEscrowBalance = await deployedTaxableTX.balanceOf(escrow.address);
    expect(finalEscrowBalance).to.equal(8);


    
  });

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
});
