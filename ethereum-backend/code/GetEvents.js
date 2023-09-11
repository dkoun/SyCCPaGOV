const ethers = require('ethers');
const { exit } = require('process');
const fs = require('fs').promises;
async function readBlockNumberFromFile(filepath) {
    try {
        const data = await fs.readFile(filepath, 'utf8');
        const blockNumber = Number(data.split('\n')[0]); // gets first line (block number)
        return blockNumber;
    } catch (err) {
        console.log("Error:", err);
    }
}

async function writeBlockNumberToFile(filename,blockNumber) {
    try {
        await fs.writeFile(filename, blockNumber.toString());
      //  console.log("Successfully wrote block number to file");
    } catch (err) {
        console.log("Error:", err);
    }
}
async function readAbi() {
    try {
        const jsonString = await fs.readFile('code/build/contracts/MyToken.json', 'utf8');
        const data = JSON.parse(jsonString);
        const abi = data.abi;
        return abi;
    } catch (err) {
        console.log("Error:", err);
    }
}

async function readContractAddress() {
    try {
        const jsonString = await fs.readFile('code/build/contracts/MyToken.json', 'utf8');
        const data = JSON.parse(jsonString);
        const addr = data.networks["11155111"].address;
        return addr;
    } catch (err) {
        console.log("Error:", err);
    }
}

async function searchEvents(from) {
    // TODO: Replace these values
    const providerUrl = 'https://sepolia.infura.io/v3/362babd917ae42ae8bfd18788c16a259';
    //const contractAddress = '0x6745411F77b2e14358f620190C6798944cb074A2';
    
    const contractABI = await readAbi();
    const contractAddress = await readContractAddress();
    // Create a provider
    let provider = new ethers.providers.JsonRpcProvider(providerUrl);
    
    // Create a contract instance
    let contract = new ethers.Contract(contractAddress, contractABI, provider);
    
    // Get the event (replace Mint with your event)
    const event = contract.filters.Mint(); 
  
    // Get the past events
    const logs = await provider.getLogs({
        fromBlock: from+1, 
        toBlock: "latest",
        address: contractAddress,
        topics: event.topics
    });
    //addition of events for yes no and abstain

    const yesVoteEvent = contract.filters.YesVote(); 
    const noVoteEvent = contract.filters.NoVote(); 
    const abstainVoteEvent = contract.filters.AbstainVote();
    let yes_count = await readBlockNumberFromFile("code/votes/yes_votes.txt")
    let no_count = await readBlockNumberFromFile("code/votes/no_votes.txt")
    let abstein_count = await readBlockNumberFromFile("code/votes/abstein_votes.txt")
    const yesVoteLogs = await provider.getLogs({
        fromBlock: from+1,
        toBlock: "latest",
        address: contractAddress,
        topics: yesVoteEvent.topics
    });
    //console.log("YES",yesVoteLogs[0].data/10**18)

    for (let logyes of yesVoteLogs) {
        
        console.log("YES",logyes.data/10**18)
        yes_count+=logyes.data/10**18
    }

    const noVoteLogs = await provider.getLogs({
        fromBlock: from+1,
        toBlock: "latest",
        address: contractAddress,
        topics: noVoteEvent.topics
    });

    for (let logno of noVoteLogs) {
        
        console.log("NO",logno.data/10**18)
        no_count+=logno.data/10**18
    }
   
    const abstainVoteLogs = await provider.getLogs({
        fromBlock: from+1,
        toBlock: "latest",
        address: contractAddress,
        topics: abstainVoteEvent.topics
    });

    
    for (let logab of abstainVoteLogs) {
        
        console.log("NO",logab.data/10**18)
        abstein_count+=logab.data/10**18
    }
    if (abstainVoteLogs.length > 0) {
        await writeBlockNumberToFile("code/votes/abstein_votes.txt",abstein_count)
        }
    if (noVoteLogs.length > 0) {
            await writeBlockNumberToFile("code/votes/no_votes.txt",no_count)
            }
    if (yesVoteLogs.length > 0) {
                await writeBlockNumberToFile("code/votes/yes_votes.txt",yes_count)
                }

    if (logs.length > 0 || abstainVoteLogs.length > 0 || yesVoteLogs.length > 0  || noVoteLogs.length > 0  ) {

    if (logs.length > 0) await writeBlockNumberToFile("code/searched_till_block.txt",logs[logs.length-1].blockNumber)
    if (abstainVoteLogs.length > 0) await writeBlockNumberToFile("code/searched_till_block.txt",abstainVoteLogs[abstainVoteLogs.length-1].blockNumber)
    if (yesVoteLogs.length > 0) await writeBlockNumberToFile("code/searched_till_block.txt",yesVoteLogs[yesVoteLogs.length-1].blockNumber)
    if (noVoteLogs.length > 0) await writeBlockNumberToFile("code/searched_till_block.txt",noVoteLogs[noVoteLogs.length-1].blockNumber)
    }
    else {
        console.log("Found nothing new yet")
    }
    // Parse the logs
    let current_count = await readBlockNumberFromFile("code/votes/ethereum_tokens.txt")
    console.log(current_count,"eeee")
    for (let log of logs) {     
        // console.log(log)
        const event = contract.interface.parseLog(log);
        // console.log(event)
        current_count += parseInt(event.args.amount.toString())
        // console.log(event.args.amount.toString());
    }
    //console.log(current_count,"eeee")
    await writeBlockNumberToFile("code/votes/ethereum_tokens.txt",current_count)

}

async function main() {
    process.chdir('ethereum-backend')
    setInterval(async () => {
        console.log("Searching for events")
        const blockNumber = await readBlockNumberFromFile("code/searched_till_block.txt");
        console.log(blockNumber)
        await searchEvents(blockNumber);
        
    }, 15000);
}

main().catch(console.error);

