# SyCCPaGOV - A system for Cross-Chain participation in Governance
A unified proposing and voting system for users in Ethereum, Cardano and Polygon

### Setup
The system requires an administrator who will provide the API Keys for Infura and Blockfrost and a mnemonic phrase of an ethereum wallet that will be filled in where needed.   
Step 1 : To deploy the ethereum contracts (same procedure in both ethereum-backend and polygon-backend)
In ethereum-backend/polygon-backend:
"npm i " to install the dependencies
For Ethereum
truffle migrate --network sepolia 
truffle run verify MyToken --network sepolia 
For Sepolia
truffle migrate --network mumbai 
truffle run verify MyToken --network mumbai 
to deploy the smart contracts

Then add the smart contract's ABI and address where designated.
 
Step 2: Create Cardano script
pip install pyCardano
pip install blockfrost
run create_address.py to create the administrative wallet
run create_policy.py to create the policy for the native token


Step 3: For the app
In the main folder:
"npm i " to install the dependencies for the app.

Step 4: To interact with the website
run :
node app.js 
and visit https://localhost:4000 

