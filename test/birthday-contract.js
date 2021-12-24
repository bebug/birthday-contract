const { expect } = require("chai");
require("@nomiclabs/hardhat-ethers");

describe("Birthday contract", function () {

    let birthdayContract;
    let proxyCoin;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        let ProxyCoin = await ethers.getContractFactory("ProxyCoin");
        let BirthdayContract = await ethers.getContractFactory("BirthdayContract");
        [owner, addr1, addr2] = await ethers.getSigners();

        proxyCoin = await ProxyCoin.deploy(10000);
        birthdayContract = await BirthdayContract.deploy(proxyCoin.address);
    });

    it("Should deposit tokens", async function() {
        await proxyCoin.approve(birthdayContract.address, 160);
        await birthdayContract.depositToken(160, addr1.address, 0);
        const balance = await birthdayContract.totalBalanceOf(addr1.address);
        expect(balance).to.equal(160);
    });

    it("Should not deposit without allowence", async function() {
        await proxyCoin.approve(birthdayContract.address, 10);
        await expect(birthdayContract.depositToken(11, addr1.address, 0)).to.be.reverted;
        const balance = await birthdayContract.totalBalanceOf(addr1.address);
        expect(balance).to.equal(0);
    });

    it("Should withdraw tokens", async function() {
        await proxyCoin.approve(birthdayContract.address, 160);
        await birthdayContract.depositToken(160, addr1.address, 0);
        const balance = await birthdayContract.totalBalanceOf(addr1.address);
        expect(await birthdayContract.totalBalanceOf(addr1.address)).to.equal(160);
        await birthdayContract.connect(addr1).withdrawToken();
        expect(await birthdayContract.totalBalanceOf(addr1.address)).to.equal(0);
    });
    
    it("Should partially withdraw tokens", async function() {
        await proxyCoin.approve(birthdayContract.address, 160);
        await birthdayContract.depositToken(100, addr1.address, 0);
        await birthdayContract.depositToken(60, addr1.address, Math.ceil(new Date().getTime() / 1000) + 60*60);
        const balance = await birthdayContract.totalBalanceOf(addr1.address);
        expect(await birthdayContract.totalBalanceOf(addr1.address)).to.equal(160);
        await birthdayContract.connect(addr1).withdrawToken();
        expect(await birthdayContract.totalBalanceOf(addr1.address)).to.equal(60);
    });
    
    it("Should receive total balance", async function() {
        await proxyCoin.approve(birthdayContract.address, 300);
        await birthdayContract.depositToken(160, addr1.address, 0);
        await birthdayContract.depositToken(100, addr1.address, 100);
        await birthdayContract.depositToken(40, addr1.address, 200);
        const balance = await birthdayContract.totalBalanceOf(addr1.address);
        expect(balance).to.equal(300);
    });
        
    it("Should receive balance until today", async function() {
        await proxyCoin.approve(birthdayContract.address, 300);
        await birthdayContract.depositToken(160, addr1.address, 0);
        await birthdayContract.depositToken(100, addr1.address, 100);
        await birthdayContract.depositToken(40, addr1.address, Math.ceil(new Date().getTime() / 1000) + 60*60);
        const balance = await birthdayContract.currentBalanceOf(addr1.address);
        expect(balance).to.equal(260);
    });

    it("Should receive next withdrawal timestamp", async function() {
        await proxyCoin.approve(birthdayContract.address, 70);
        await birthdayContract.depositToken(30, addr1.address, 20);
        await birthdayContract.depositToken(10, addr1.address, 10);
        await birthdayContract.depositToken(10, addr1.address, 0);
        await birthdayContract.depositToken(20, addr1.address, 10);
        
        [timestamp, amount] = await birthdayContract.nextWithdrawal(addr1.address, 1);
        expect(timestamp).to.equal(10);
        expect(amount).to.equal(40);

        [timestamp, amount] = await birthdayContract.nextWithdrawal(addr1.address, 0);
        expect(timestamp).to.equal(0);
        expect(amount).to.equal(10);

        [timestamp, amount] = await birthdayContract.nextWithdrawal(addr1.address, 5);
        expect(timestamp).to.equal(10);
        expect(amount).to.equal(40);

        [timestamp, amount] = await birthdayContract.nextWithdrawal(addr1.address, 10);
        expect(timestamp).to.equal(10);
        expect(amount).to.equal(40);

        [timestamp, amount] = await birthdayContract.nextWithdrawal(addr1.address, 25);
        expect(timestamp).to.above(99999);
        expect(amount).to.equal(70);
    });

    it("Should receive next withdrawal timestamp from 0", async function() {
        await proxyCoin.approve(birthdayContract.address, 10);
        await birthdayContract.depositToken(10, addr1.address, 20);
        
        [timestamp, amount] = await birthdayContract.nextWithdrawal(addr1.address, 0);
        expect(timestamp).to.equal(20);
        expect(amount).to.equal(10);
    });

    it("Should receive no withdrawal timestamp", async function() {
        [timestamp, amount] = await birthdayContract.nextWithdrawal(addr1.address, 0);
        expect(timestamp).to.above(99999);
        expect(amount).to.equal(0);
    });

    it("Should revert empty withdrawal", async function() {
        await expect(birthdayContract.withdrawToken()).to.be.reverted;
    });

});