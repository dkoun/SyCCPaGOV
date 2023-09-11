const fs = require('fs');
const fsp = require('fs').promises;
const { Web3 } = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const ethers = require('ethers');
const { time } = require('console');


// Contract ABI 
var contractABI1 = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"InvalidShortString","type":"error"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"StringTooLong","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"power","type":"uint256"}],"name":"AbstainVote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"EIP712DomainChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"power","type":"uint256"}],"name":"NoVote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"power","type":"uint256"}],"name":"YesVote","type":"event"},{"inputs":[],"name":"CLOCK_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"approveAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approveContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint32","name":"pos","type":"uint32"}],"name":"checkpoints","outputs":[{"components":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint224","name":"votes","type":"uint224"}],"internalType":"struct ERC20Votes.Checkpoint","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"clock","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastTotalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAbstainVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalNoVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalYesVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"voteAbstain","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"voteNo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"voteYes","outputs":[],"stateMutability":"nonpayable","type":"function"}] // Insert Ethereum's contract ABI

var contractABI2 = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"InvalidShortString","type":"error"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"StringTooLong","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"power","type":"uint256"}],"name":"AbstainVote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"EIP712DomainChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"power","type":"uint256"}],"name":"NoVote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"power","type":"uint256"}],"name":"YesVote","type":"event"},{"inputs":[],"name":"CLOCK_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"approveAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approveContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint32","name":"pos","type":"uint32"}],"name":"checkpoints","outputs":[{"components":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint224","name":"votes","type":"uint224"}],"internalType":"struct ERC20Votes.Checkpoint","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"clock","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastTotalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenPrice","type":"uint256"}],"name":"setTokenPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAbstainVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalNoVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalYesVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"voteAbstain","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"voteNo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"voteYes","outputs":[],"stateMutability":"nonpayable","type":"function"}] //insert Polygon's contract ABI


let continueProcessing = true; // Flag to control loop execution
// let start=false;

var infuraUrl1 = "insert infura url here for Ethereum";
var infuraUrl2 = "insert infura url here for Polygon";

// Contract address
var contractAddress1 = 'insert contract address of Ethereum here'; 
var contractAddress2 = 'insert contract address of Polygon here';


// Account
var account = 'insert account address here';

// Mnemonic
var mnemonic = "insert mnemonic phrase of owner account here";


async function pauseContract(mnemonic, infuraUrl, contractAddress, contractABI, account) {
  let provider = new HDWalletProvider(mnemonic, infuraUrl);
  const web3 = new Web3(provider);

  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const data = contract.methods.pause().encodeABI();
  const gasPrice = await web3.eth.getGasPrice();
  const gasEstimate = await contract.methods.pause().estimateGas({ from: account });

  const transactionParameters = {
    nonce: '0x' + (await web3.eth.getTransactionCount(account)).toString(16),
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasEstimate),
    to: contractAddress,
    data: data,
  };

  try {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    const signedTx = await web3.eth.accounts.signTransaction(transactionParameters, wallet.privateKey);
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Transaction hash:', txReceipt.transactionHash);
  } catch (error) {
    console.error('An error occurred:', error);
  }
  provider.engine.stop();

}


async function unpauseContract(mnemonic, infuraUrl, contractAddress, contractABI, account) {
  let provider = new HDWalletProvider(mnemonic, infuraUrl);
  const web3 = new Web3(provider);

  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const data = contract.methods.unpause().encodeABI();
  const gasPrice = await web3.eth.getGasPrice();
  const gasEstimate = await contract.methods.unpause().estimateGas({ from: account });

  const transactionParameters = {
    nonce: '0x' + (await web3.eth.getTransactionCount(account)).toString(16),
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasEstimate),
    to: contractAddress,
    data: data,
  };

  try {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    const signedTx = await web3.eth.accounts.signTransaction(transactionParameters, wallet.privateKey);
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Transaction hash:', txReceipt.transactionHash);
  } catch (error) {
    console.error('An error occurred:', error);
  }
  provider.engine.stop();

}


function startClock() {
    return setInterval(function() {
      const now = new Date();
      console.log(now.toLocaleTimeString());
    }, 1000);
  }

  function disableExit() {
    const filePath = 'cardano-backend/code/enable_exit.txt';
    fs.writeFile(filePath, 'false', 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to ${filePath}:`, err);
      } else {
        console.log(`Successfully wrote "false" to ${filePath}`);
      }
    });
  }
function enableExit() {
    const filePath = 'cardano-backend/code/enable_exit.txt';
    fs.writeFile(filePath, 'true', 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to ${filePath}:`, err);
      } else {
        console.log(`Successfully wrote "true" to ${filePath}`);
      }
    });
  }
  // Function to pause contracts after a designated period (e.g., 5 minutes)
async function pauseContractsAfterDelay(delayInMinutes) {
    await delay(delayInMinutes * 60 * 1000);
    await pauseContract(mnemonic, infuraUrl1, contractAddress1, contractABI1, account);
    console.log('Contract 1 has been paused');
    await pauseContract(mnemonic, infuraUrl2, contractAddress2, contractABI2, account);
    console.log('Contract 2 has been paused');
    enableExit();
    continueProcessing = false;
}
  
function checkQuorum(resultData, quorumThreshold) {
    const totalVotes = resultData[0].yes_votes + resultData[0].no_votes + resultData[0].abstain_votes;
    const quorum = (totalVotes / resultData[0].total_tokens) * 100; // Calculate quorum as a percentage
  
    if (quorum >= quorumThreshold) {
      resultData[0].quorum_reached = true;
      console.log(`Quorum reached: ${quorum.toFixed(2)}% of total votes. Threshold: ${quorumThreshold}%`);
      if (resultData[0].yes_votes > resultData[0].no_votes) {
        resultData[0].result = true;
        console.log('Proposal passed');
      }
      else{
        resultData[0].result = false;
        console.log('Proposal failed');
      }
    } else {
      resultData[0].quorum_reached = false;
      console.log(`Quorum not reached: ${quorum.toFixed(2)}% of total votes. Threshold: ${quorumThreshold}%`);
    }
    
  }

async function readJsonFileAsync(filePath) {
  const data = await fsp.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function readNumbersFromFile(filePath, divideBy = 1) {
  const data = await fsp.readFile(filePath, 'utf8');
  return data.split('\n').filter(Boolean).map(number => parseFloat(number) / divideBy);
}

async function processTxtFiles(fileSet, divideTokensBy = 1) {
  const numbersTokens = await readNumbersFromFile(fileSet[0], divideTokensBy);
  const numbersYes = await readNumbersFromFile(fileSet[1]);
  const numbersNo = await readNumbersFromFile(fileSet[2]);
  const numbersAbstein = await readNumbersFromFile(fileSet[3]);

  totalTokens += numbersTokens.reduce((acc, curr) => acc + curr, 0);
  totalVotesYes += numbersYes.reduce((acc, curr) => acc + curr, 0);
  totalVotesNo += numbersNo.reduce((acc, curr) => acc + curr, 0);
  totalVotesAbstein += numbersAbstein.reduce((acc, curr) => acc + curr, 0);
}

async function processFiles(inputJsonFile, inputTxtFileSet1, inputTxtFileSet2, cardanoTokensFile, i, time) {
  try {
    const jsonDataArray = await readJsonFileAsync(inputJsonFile);

    totalTokens = 0;
    totalVotesYes = 0;
    totalVotesNo = 0;
    totalVotesAbstein = 0;

    jsonDataArray.forEach(item => {
      const tokenAmount = parseInt(item.token_amount, 10);
      if (item.vote === 'yes') totalVotesYes += tokenAmount;
      else if (item.vote === 'no') totalVotesNo += tokenAmount;
      else if (item.vote === 'abstein') totalVotesAbstein += tokenAmount;
    });

    await processTxtFiles(inputTxtFileSet1, Math.pow(10, 18)); // Ethereum
    await processTxtFiles(inputTxtFileSet2, Math.pow(10, 18)); // Ethereum

    const cardanoTokens = await readNumbersFromFile(cardanoTokensFile); // No division
    totalTokens += cardanoTokens.reduce((acc, curr) => acc + curr, 0);

    const resultData = [
      {
        total_tokens: totalTokens,
        yes_votes: totalVotesYes,
        no_votes: totalVotesNo,
        abstain_votes: totalVotesAbstein,
        duration: DURATION - 15000 * i > 0 ? DURATION - 15000 * i : 0,
        proposal: YOUR_STRING_ARGUMENT,
        finished: false,
        result: null,
        quorum_reached: false,
        quadratic_voting: false,
        start_time: time,
        description: DESCRIPTION
      },
    ];

    const outputFile = 'results.json';
    await fsp.writeFile(outputFile, JSON.stringify(resultData, null, 2), 'utf8');
    console.log(`Successfully saved the result to ${outputFile} from process files`);
    console.log('Result data:', resultData);
    return resultData;
  } catch (err) {
    console.error('Error processing files:', err);
    return null;
  }
}

let totalTokens, totalVotesYes, totalVotesNo, totalVotesAbstein;

const inputJsonFile = 'cardano-backend/votes/token_balance.json';

const inputTxtFileSet1 = [
  'ethereum-backend/code/votes/ethereum_tokens.txt',
  'ethereum-backend/code/votes/yes_votes.txt',
  'ethereum-backend/code/votes/no_votes.txt',
  'ethereum-backend/code/votes/abstein_votes.txt',
];

const inputTxtFileSet2 = [
  'polygon-backend/code/votes/ethereum_tokens.txt',
  'polygon-backend/code/votes/yes_votes.txt',
  'polygon-backend/code/votes/no_votes.txt',
  'polygon-backend/code/votes/abstein_votes.txt',
];

const cardanoTokensFile = 'cardano-backend/votes/cardano_tokens.txt';

const DURATION = process.argv[2] ? parseInt(process.argv[2], 10) : 3600000; // Default to 1 hour if not specified
const YOUR_STRING_ARGUMENT = process.argv[3] ? process.argv[3] : 'Default Proposal'; // Replace with your default proposal
const quadraticVoting = process.argv[4] ? process.argv[4] === 'true' : false; // Default to false if not provided
const quorumThreshold = Number(process.argv[5]) || 50; // Default to 50 if not provided
const DESCRIPTION = process.argv[6] || ""; // Default to empty string if not provided

console.log('DURATION:', DURATION);
console.log('YOUR_STRING_ARGUMENT:', YOUR_STRING_ARGUMENT);
console.log('quadraticVoting:', quadraticVoting);
console.log('quorumThreshold:', quorumThreshold);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function resetVotesAndAdjustTokens() {
  // Scaling factor for Ethereum and Polygon tokens
  const scalingFactor = BigInt(10 ** 18);

  // Paths for Ethereum votes
  const ethereumVotesFiles = [
    'ethereum-backend/code/votes/yes_votes.txt',
    'ethereum-backend/code/votes/no_votes.txt',
    'ethereum-backend/code/votes/abstein_votes.txt',
  ];
  const totalVotesEthereum = await getTotalVotes(ethereumVotesFiles);
  const ethereumTokensFile = 'ethereum-backend/code/votes/ethereum_tokens.txt';
  await updateTokens(ethereumTokensFile, totalVotesEthereum * scalingFactor);

  // Paths for Polygon votes
  const polygonVotesFiles = [
    'polygon-backend/code/votes/yes_votes.txt',
    'polygon-backend/code/votes/no_votes.txt',
    'polygon-backend/code/votes/abstein_votes.txt',
  ];
  const totalVotesPolygon = await getTotalVotes(polygonVotesFiles);
  const polygonTokensFile = 'polygon-backend/code/votes/ethereum_tokens.txt';
  await updateTokens(polygonTokensFile, totalVotesPolygon * scalingFactor);

  // JSON file path for Cardano
  const jsonFilePath = 'cardano-backend/votes/token_balance.json';
  const jsonData = await readJsonFileAsync(jsonFilePath);
  const totalVotingPowerCardano = jsonData.reduce((sum, item) => sum + BigInt(item.token_amount), BigInt(0));
  const cardanoTokensFile = 'cardano-backend/votes/cardano_tokens.txt';
  await updateTokens(cardanoTokensFile, totalVotingPowerCardano);

  // Resetting the votes
  for (const filePath of [...ethereumVotesFiles, ...polygonVotesFiles]) {
    await fsp.writeFile(filePath, '0\n', 'utf8');
  }

  // Making the content of the JSON file []
  await fsp.writeFile(jsonFilePath, '[]', 'utf8');

  console.log('Tokens have been adjusted and votes have been reset.');
}

async function getTotalVotes(votesFiles) {
  let totalVotes = BigInt(0);
  for (const filePath of votesFiles) {
    const votes = await readNumbersFromFile(filePath);
    totalVotes += votes.reduce((sum, vote) => sum + BigInt(vote), BigInt(0));
  }
  return totalVotes;
}

async function updateTokens(tokenFile, totalVotes) {
  const tokens = await readNumbersFromFile(tokenFile);
  const newTokens = tokens.map(token => BigInt(token) - totalVotes);
  await fsp.writeFile(tokenFile, newTokens.join('\n'), 'utf8');
}

async function getEquivalentMaticAmount() {
  try {
    // Fetch Ethereum and Polygon prices from CoinGecko
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network&vs_currencies=usd');
    const data = await response.json();

    const ethPrice = data.ethereum.usd;
    const polygonPrice = data['matic-network'].usd;

    console.log(`Ethereum price: $${ethPrice}`);
    console.log(`Polygon price: $${polygonPrice}`);

    // Calculate the equivalent amount of MATIC that equals 0.0001 Ethereum
    const ethAmount = 0.0001;
    const equivalentMaticAmount = (ethAmount * ethPrice) / polygonPrice;

    console.log(`Equivalent amount of MATIC for ${ethAmount} ETH: ${equivalentMaticAmount}`);

    return equivalentMaticAmount;
  } catch (error) {
    console.error(error);
    return null;
  }
}


async function updateContractWithPrice() {
  // Create a local instance of Web3
  let provider = new HDWalletProvider(mnemonic, infuraUrl2);
  const web3Instance = new Web3(provider);

  try {
    const equivalentMaticAmount = await getEquivalentMaticAmount();
    const roundedNumber =parseInt(parseFloat(equivalentMaticAmount.toFixed(3))*1000);

    console.log('Equivalent Matic Amount:', roundedNumber); // Debugging line

    const tokenPrice = await web3Instance.utils.toBN(roundedNumber).mul(web3Instance.utils.toBN('1000000000000000'));
    console.log('Token price:', tokenPrice.toString()); // Debugging line
    const contract = new web3Instance.eth.Contract(contractABI2, contractAddress2);

    // Define the setTokenPrice method
    const myMethod = contract.methods.setTokenPrice(tokenPrice);

    const gas = await web3Instance.eth.estimateGas({
      to: contractAddress2,
      from: account,
      data: myMethod.encodeABI()
    });

    const tx = {
      to: contractAddress2,
      gas,
      data: myMethod.encodeABI()
    };
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    //console.log('Wallet address:', wallet.privateKey); // Debugging line
    const signedTx = await web3Instance.eth.accounts.signTransaction(tx,wallet.privateKey);

    const receipt = await web3Instance.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log('Transaction receipt:', receipt);
    provider.engine.stop();
    return receipt;
  } catch (error) {
    console.error(error);
    provider.engine.stop();
    return null;
  }
  

}


//updateContractWithPrice();



async function main() {
  // Reset the votes and adjust the tokens for the quorum
  await resetVotesAndAdjustTokens();
  console.log('(fun) Votes have been reset and tokens have been adjusted.');
  await unpauseContract(mnemonic, infuraUrl1, contractAddress1, contractABI1, account);
  console.log('(fun) Contract 1 has been unpaused.');
  await unpauseContract(mnemonic, infuraUrl2, contractAddress2, contractABI2, account);
  console.log('(fun) Contract 2 has been unpaused.');
  await updateContractWithPrice();
  console.log('(fun) Contract 2 has been updated with price.');
  disableExit()
  console.log('(fun) Cardano script ready');

  // Start the real-time clock
  const clockIntervalId=startClock();

  const now = new Date();
  const time = now.toLocaleTimeString();

  // Pause the contracts after the specified duration (in minutes)
  pauseContractsAfterDelay(DURATION / 60000);
  var i = 0;
  while (continueProcessing) {  
    console.log('Start of loop iteration');
    console.log('Waiting 15 seconds before next iteration...');
    await delay(15000);
    // Process the files and get the result
    await processFiles(inputJsonFile, inputTxtFileSet1, inputTxtFileSet2, cardanoTokensFile, i, time)
      .catch((err) => {
        console.error('Error processing files:', err);
      });

      i += 1;
  }
  //Load result data from file

  console.log('Loop has been stopped. Contracts are paused.');
  const resultData = await readJsonFileAsync('results.json');
  console.log('Result data loaded from file:', resultData);
  resultData[0].finished = true;
  console.log('Result data updated with finished:', resultData);
    // Check if quorum is reached
  checkQuorum(resultData, quorumThreshold);

  const outputFile = 'results.json';
  await fsp.writeFile(outputFile, JSON.stringify(resultData, null, 2), 'utf8');
  console.log(`Successfully saved the result to ${outputFile}`);


  console.log('Result data ready', resultData);
  clearInterval(clockIntervalId);

}


main();
//resetVotesAndAdjustTokens();