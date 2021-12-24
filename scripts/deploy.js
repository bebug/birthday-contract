async function main() {
// We get the contract to deploy
const Birthday = await ethers.getContractFactory("BirthdayContract");
const birthday = await Birthday.deploy("0x78867bbeef44f2326bf8ddd1941a4439382ef2a7");

console.log("Birthday contract deployed to:", birthday.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});