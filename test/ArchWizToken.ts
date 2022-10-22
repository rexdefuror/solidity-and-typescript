import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("Arch Wizard Gems", function () {
    let archWizToken: any;
    let owner: any;
    let minter: any;
    let buyer: any;

    this.beforeAll(async () => {
        [owner, minter, buyer] = await ethers.getSigners();

        const ArchWizToken = await ethers.getContractFactory("ArchWizToken");
        archWizToken = await upgrades.deployProxy(ArchWizToken, [ethers.utils.parseEther("1000000")]);
        await archWizToken.deployed();
    });

    describe("Deployment", function () {
        it("Should have a name", async function () {
            expect(await archWizToken.name()).to.equal("Arch Wizard Gems");
        });

        it("Should have a symbol", async function () {
            expect(await archWizToken.symbol()).to.equal("AWG");
        });

        it("Should have 18 decimals", async function () {
            expect(await archWizToken.decimals()).to.equal(18);
        });
    });

    describe("State", function () {
        it("Should have a max supply of 1,000,000", async function () {
            expect(await archWizToken.maximumSupply()).to.equal(ethers.utils.parseEther("1000000"));
        });
        it("Should be able to add minter", async function () {
            const addMinterTx = await archWizToken.addMinter(minter.address);
            await addMinterTx.wait();
            expect(await archWizToken.minters(minter.address)).to.be.true;
        });
        it("Should be able to remove minter", async function () {
            const removeMinterTx = await archWizToken.removeMinter(minter.address);
            await removeMinterTx.wait();
            expect(await archWizToken.minters(minter.address)).to.be.false;
        });
    });

    describe("Minting", function () {
        it("Should be able to mint", async function () {
            const mintTx = await archWizToken.mint(buyer.address, ethers.utils.parseEther("100"));
            await mintTx.wait();
            expect(await archWizToken.balanceOf(buyer.address)).to.equal(ethers.utils.parseEther("100"));
        });
        it("Should not be able to mint more than max supply", async function () {
            await expect(archWizToken.mint(buyer.address, ethers.utils.parseEther("1000001"))).to.be.revertedWith("Max supply reached");
        });
        it("Should not be able to mint as non-minter", async function () {
            await expect(archWizToken.connect(buyer).mint(buyer.address, ethers.utils.parseEther("100"))).to.be.reverted;
        });
    });

    describe("Burning", function () {
        it("Should be able to burn", async function () {
            const burnTx = await archWizToken.burn(buyer.address, ethers.utils.parseEther("100"));
            await burnTx.wait();
            expect(await archWizToken.balanceOf(buyer.address)).to.equal(ethers.utils.parseEther("0"));
        });
        it("Should not be able to burn more than balance", async function () {
            await expect(archWizToken.burn(buyer.address, ethers.utils.parseEther("1"))).to.be.revertedWith("ERC20: burn amount exceeds balance");
        });
        it("Should not be able to burn as non-minter", async function () {
            await expect(archWizToken.connect(buyer).burn(buyer.address, ethers.utils.parseEther("100"))).to.be.reverted;
        });
    });

    describe("Upgradeable", function () {
        it("Should be able to upgrade", async function () {
            const ArchWizTokenV2 = await ethers.getContractFactory("ArchWizTokenV2");
            archWizToken = await upgrades.upgradeProxy(archWizToken.address, ArchWizTokenV2);
            expect(await archWizToken.name()).to.equal("Arch Wizard Gems");
        });
        it("Should be able to burn supply", async function () {
            const burnTx = await archWizToken.burnSupply(ethers.utils.parseEther("100"));
            await burnTx.wait();
            expect(await archWizToken.maximumSupply()).to.equal(ethers.utils.parseEther("999900"));
        });
        it("Should be able to check remaining supply", async function () {
            const mintTx = await archWizToken.mint(buyer.address, ethers.utils.parseEther("100"));
            await mintTx.wait();
            expect(await archWizToken.balanceOf(buyer.address)).to.equal(ethers.utils.parseEther("100"));
            expect(await archWizToken.remainingSupply()).to.equal(ethers.utils.parseEther("999800"));
        });
    });

});