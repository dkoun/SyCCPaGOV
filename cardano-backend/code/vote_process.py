from blockfrost import BlockFrostApi, ApiError, ApiUrls
import os
from dotenv import load_dotenv
from pycardano import *
import random
import json
import time
import pathlib
import requests
import sys
load_dotenv()  

blockfrost_key = os.getenv("BLOCK_FROST_KEY")

policy_id = "069ac347f32b591c5401a73ce2f27a8703d093d17b7ee40a601b941d"
asset_name = "74657374474f56" 
full_hex_name = policy_id + asset_name
transaction_count = 0



def get_price_ratio():
    # Get ETH price
    eth_url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    eth_response = requests.get(eth_url)
    eth_data = eth_response.json()
    eth_price = eth_data['ethereum']['usd']

    # Get ADA price
    ada_url = "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd"
    ada_response = requests.get(ada_url)
    ada_data = ada_response.json()
    ada_price = ada_data['cardano']['usd']

    # Calculate and return the ratio
    return eth_price / ada_price

def calculate_equivalent_eth(ada_amount):
    # Get the price ratio of ETH to ADA
    eth_to_ada_ratio = get_price_ratio()

    # Calculate and return the equivalent amount of ETH
    return ada_amount / eth_to_ada_ratio







def load_or_create_key_pair(base_dir, base_name):
    skey_path = base_dir / f"{base_name}.skey"
    vkey_path = base_dir / f"{base_name}.vkey"


    if skey_path.exists():
        skey = PaymentSigningKey.load(str(skey_path))
        vkey = PaymentVerificationKey.from_signing_key(skey)
        print("Found testnet/keys")
    else:
        print("I shouldn't be here")
        key_pair = PaymentKeyPair.generate()
        key_pair.signing_key.save(str(skey_path))
        key_pair.verification_key.save(str(vkey_path))
        skey = key_pair.signing_key
        vkey = key_pair.verification_key
    return skey, vkey

def tokens_count(amount): #so i keep count of the total voting power
    # check if file exists and get the total balance
    filename= "votes/cardano_tokens.txt"
    if os.path.exists(filename):
        with open(filename, "r") as file:
            total_tokens = int(file.read())

    # update the total balance
    total_tokens += int(amount)

    # save the new balance back to the file
    with open(filename, "w") as file:
        file.write(str(total_tokens))

#1.20 ada sent = 1 yes vote
#1.21 ada sent = 1 no vote
#1.22 ada sent = 1 abstain vote


def tokens_sent(address, amount, vote):
    filename = "votes/token_balance.json"
    data = []

    # Check if file exists and load the data
    if os.path.exists(filename):
        with open(filename, "r") as file:
            data = json.load(file)

    # Append new voter data
    new_voter = {
        "address": address,
        "token_amount": amount,
        "vote": vote
    }
    data.append(new_voter)

    # Save the updated data back to the file
    with open(filename, "w") as file:
        json.dump(data, file,indent=4)

    # Print the new balance
    print(f"New voting: {new_voter}")





def MintGOV(array, values):

    PROJECT_ROOT = ""
    root = pathlib.Path(PROJECT_ROOT)
    BLOCK_FROST_PROJECT_ID = blockfrost_key
    NETWORK = Network.TESTNET

    # Create the directory if it doesn't exist
    root.mkdir(parents=True, exist_ok=True)
    key_dir = root / "keys"
    key_dir.mkdir(exist_ok=True)

    payment_skey, payment_vkey = load_or_create_key_pair(key_dir, "payment")

    address = Address(payment_vkey.hash(), network=NETWORK)


    # Generate policy testnet/keys, which will be used when minting NFT
    policy_skey, policy_vkey = load_or_create_key_pair(key_dir, "policy")
    with open("keys/policy.script") as f:
        data = f.read()
    f.close()
    dictionary_input = json.loads(data)
    policy = ScriptAll.from_dict(dictionary_input)
    policy_id = policy.hash()
    #!#!#!#!#!#!#!#!#!#!#!#!#!#!#!#!#!#!#!#!#!#!#!							
    print(len(array))
    
    for p in range(0,1):
        
        address_to_mint = array
        value_to_mint = values
        print("Will mint on this address: " + address_to_mint)
        my_asset = Asset()

        # name the assets
        tok = AssetName(bytes("testGOV",'UTF-8'))
        my_asset[tok] = int(value_to_mint)

        #container that can hold multiple assets, though here we just need one
        token  = MultiAsset()
        token [policy_id] = my_asset

        # final native script that will be attached to the transaction
        native_scripts = [policy]

        ID = "testGOV"
        
        metadata = {
            721: {  # NFTs and tokens have similar metadata so we can use the same.
                policy_id.payload.hex(): {
                    f"{ID}": {
                        "Description": "testGOV for testing purposes",
                        "name": "testGOV",
                        "image": "ipfs://"                   
                    }
                }
            }
        }
        auxiliary_data = AuxiliaryData(AlonzoMetadata(metadata=Metadata(metadata)))
        while (True):
            try:
                time.sleep(10)
                chain_context = BlockFrostChainContext(
                project_id=BLOCK_FROST_PROJECT_ID,
                base_url=ApiUrls.preprod.value,
                )
                # Create a transaction builder
                builder = TransactionBuilder(chain_context)

                # Add our own address as the input address
                builder.add_input_address(address)
                must_before_slot = InvalidHereAfter(chain_context.last_block_slot + 10000) #1 year locked-policy
                # Since an InvalidHereAfter rule is included in the policy, we must specify time to live (ttl) for this transaction
                builder.ttl = must_before_slot.after

                # token we want to mint
                builder.mint = token 

                # Set native script
                builder.native_scripts = native_scripts

                # Set transaction metadata
                builder.auxiliary_data = auxiliary_data

                # Calculate the minimum amount of lovelace that need to hold the NFT we are going to mint
                min_val = min_lovelace(
                    chain_context, output=TransactionOutput(Address.from_primitive(address_to_mint), Value(0, token ))
                )
                #print(min_val,type(min_val),"ee")
                builder.add_output(TransactionOutput(Address.from_primitive(address_to_mint), Value(min_val, token )))

                # final signed transaction
                signed_tx = builder.build_and_sign([payment_skey, policy_skey], change_address=address)

                print("############### Transaction created ###############")
               
                # Submit signed transaction to the network
                print("############### Submitting transaction ###############")
                #print("Would have minted 1 but didn't because we are testing")

                chain_context.submit_tx(signed_tx.to_cbor())
                print("Minted. ", signed_tx.id)
                break
            except ApiError as e:
                print(e)
                time.sleep(5)
        #print("Would have increased last minted by 1 but didn't because we are testing!") 
    
       


        time.sleep(50)


def Process_tx(address_voter,voting_power,tx_hash_,received_token):
    global transaction_count
    #print(transaction_count)
    network = Network.TESTNET
    sk = PaymentSigningKey.load("keys/payment.skey") 
    vk = PaymentVerificationKey.from_signing_key(sk)
    address = Address(vk.hash(), None, network)
    while (True):#wehatever happens we need the tx to be submitted that's why we have infinite loop
        time.sleep(10)
        context = BlockFrostChainContext(blockfrost_key, base_url=ApiUrls.preprod.value)
        builder = TransactionBuilder(context)
        builder.add_input_address(address)
        flag_exit = False
        for k in range(0,1):
            transaction_count += 1
            if (received_token == "ADA"):
                print("Will go ahead and mint")
                MintGOV(address_voter,voting_power)
                flag_exit = True
                #builder.add_output(MintGOV(address_voter,voting_power))   
            elif (received_token == "testGOV"):
                builder.add_output(TransactionOutput(
                Address.from_primitive(address_voter),Value.from_primitive([int(voting_power)])))
            else: 
                exit("something went wrong, find me")
       
        if (flag_exit):
            break 
        signed_tx = builder.build_and_sign([sk], change_address=address)
        print()
        print()
        print("Trying to submit transaction..")
        print()
        print()
        try: 
            context.submit_tx(signed_tx.to_cbor())
            

        except ApiError as e:
            time.sleep(10)
            print("Too fast, try again later")
            print(e)
        time.sleep(50)
        print("Trying to validate that my transaction had been submitted...")
        tries = 0
        is_submitted = False
        while (True):
           tries += 1
           try:
                temp_api = BlockFrostApi(
                project_id = blockfrost_key,  
                base_url=ApiUrls.preprod.value,
            )
                api_return = temp_api.transaction_utxos(str(signed_tx.id))
                is_submitted = True
                break
           except ApiError as e:
                print(e, "Error while checking for legitmacy of the SUBMITTED transaction hash. Waiting 30 seconds..", signed_tx.id)
                time.sleep(30)
                if (tries >= 15):
                    print()
                    print("Transaction FAILED.")
                    print()
                    break
        if (is_submitted):    
            print()
            print()
            print("Succesful submission!", signed_tx.id)
            print()
            print()
            break
        else:
            time.sleep(10)
            print("Trying again..")
            transaction_count = 0
            Process_tx(address_voter,voting_power,tx_hash_,received_token)
            break
    

def ProcessInputs(array): #processes the tx to be sent
    to_send_addresses = []
    to_send_values = []
    to_send_hashes = []
    to_send_coins = []
    global market_price
 
   
    for i in range(0,len(array)): 
        #n = random.randint(0,99)
        current_price = 1
        to_send_addresses.append(array[i]["received_address"])
        to_send_hashes.append(array[i]["tx_id"])
        to_send_coins.append(array[i]["token"])
        if (array[i]["token"] == "ADA"):
            to_send_values.append(str(round(calculate_equivalent_eth(int(array[i]["received_value"])/1000000)*10000)))
            to_send_values.append(str(int((int(array[i]["received_value"])//(current_price)))))
            tokens_count(str(round(calculate_equivalent_eth(int(array[i]["received_value"])/1000000)*10000)))
            print("Will send this amount of tokens: ",str(round(calculate_equivalent_eth(int(array[i]["received_value"])/1000000)*10000)))
            # exit()
 
        elif (array[i]["token"] == "testGOV"):
            to_send_values.append(str(1000000)) #on-chain confirmation
            vote = array[i]["vote"]
            voting_power = array[i]["received_value"]
            tokens_sent(array[i]["received_address"],array[i]["received_value"],array[i]["vote"])
            # to_send_values.append(str(int(0.90*current_price*(int(array[i]["received_value"])))))
            print(array[i]["received_address"],array[i]["received_value"],array[i]["vote"])
            # exit()
        else: 
            exit("Wrong token received? Why Am i here?")
        
    for j in range(0,len(to_send_addresses)):     

        try:
            print(j,len(to_send_addresses),len(to_send_values),len(to_send_hashes),len(to_send_coins))
            Process_tx(to_send_addresses[j],to_send_values[j],to_send_hashes[j],to_send_coins[j])

        except Exception as e:
            print("Couldn't send ITEMS!", e)

    to_send_addresses.clear()
    to_send_values.clear()
    to_send_hashes.clear()
    to_send_coins.clear()
    if (len(to_send_addresses) > 0):
        try: Process_tx(to_send_addresses,to_send_values,to_send_hashes,to_send_coins)
        except Exception as e:
                print("Couldn't send ITEMS2!",e)


os.chdir('cardano-backend')
while (True):
    with open("code/enable_exit.txt", 'r') as b:
        temp = b.read()
        if (temp == "True" or temp == "true"): 
            exit_flag = True
        else: 
            exit_flag = False
    b.close()
   
    if exit_flag:
        exit("Exit requested")




    print("Still searching for incoming transactions..")
    time.sleep(15)
    
    with open("code/satisfied_till_block.txt", 'r') as h:
        start_block = h.read()
    h.close()
    with open("code/satisfied_till_index.txt", 'r') as n:
        tx_index = n.read()
    n.close()

    with open("keys/address.txt", 'r') as h:
        listener = h.read()
    h.close()

    api = BlockFrostApi(
        project_id = blockfrost_key,  # or export environment variable BLOCKFROST_PROJECT_ID ,
    
        base_url=ApiUrls.preprod.value, #testnet
    )
    try:
        saved_tx_ids = []
        tx_ids = api.address_transactions(
            listener, f"{start_block}:{tx_index}")
        for i in tx_ids:
            saved_tx_ids.append(i)  
       
        print(len(saved_tx_ids)) #Got to fix if >100

        
        if (len(saved_tx_ids) != 0): 
            print("Searching for transactions at: ", f"{start_block}:{tx_index}")
            satisfied_till_block = saved_tx_ids[len(saved_tx_ids)-1].block_height #Till which Block I have gathered the transactions
            tx_index_last = saved_tx_ids[len(saved_tx_ids)-1].tx_index
            print("I collected "+ str(len(saved_tx_ids))+ " transactions IDs till block " + str(satisfied_till_block)+ " and tx_index="+ str(tx_index_last))

            print("Heading to find addresses to which we own NFTs:")
            #
            addresses_that_sent_ADA = []
            for j in range (0,len(saved_tx_ids)):
                utxos = api.transaction_utxos(saved_tx_ids[j].tx_hash)
        
                for u in utxos.outputs:
                    if (len(u.amount) >= 2):
                        print(len(u.amount), u.amount, u.amount[1].quantity,"tokens", u.amount[0].quantity,"lovelace")
                    if ((u.address == listener and utxos.inputs[0].address != listener and int(u.amount[0].quantity) >= 2000000 )): # 1M lovelace = 1 ada , != listener so as not to get the utxo that goes back to ourself
                        participant = {
                                "received_value": u.amount[0].quantity, # $ADA added
                                "received_address": utxos.inputs[0].address,
                                "tx_id": saved_tx_ids[j].tx_hash,
                                "token": "ADA",
                                "vote": "null"
                        }
                        addresses_that_sent_ADA.append(participant)
                    elif ((u.address == listener and utxos.inputs[0].address != listener and len(u.amount) >= 2 and u.amount[1].unit == full_hex_name and int(u.amount[0].quantity)==1200000)): # 1.20 ada yes
                        participant = {
                                "received_value": u.amount[1].quantity, # $send testGOV
                                "received_address": utxos.inputs[0].address,
                                "tx_id": saved_tx_ids[j].tx_hash,
                                "token": "testGOV",
                                "vote": "yes"
                        }
                        addresses_that_sent_ADA.append(participant)
                    elif ((u.address == listener and utxos.inputs[0].address != listener and len(u.amount) >= 2 and u.amount[1].unit == full_hex_name and int(u.amount[0].quantity)==1210000)): # 1.21 ada no
                        participant = {
                                "received_value": u.amount[1].quantity, # $send testGOV
                                "received_address": utxos.inputs[0].address,
                                "tx_id": saved_tx_ids[j].tx_hash,
                                "token": "testGOV",
                                "vote": "no"
                        }
                        addresses_that_sent_ADA.append(participant)
                    elif ((u.address == listener and utxos.inputs[0].address != listener and len(u.amount) >= 2 and u.amount[1].unit == full_hex_name and int(u.amount[0].quantity)==1220000)): # 1.22 ada abstein
                        participant = {
                                "received_value": u.amount[1].quantity, # $send testGOV
                                "received_address": utxos.inputs[0].address,
                                "tx_id": saved_tx_ids[j].tx_hash,
                                "token": "testGOV",
                                "vote": "abstein"
                        }
                        addresses_that_sent_ADA.append(participant)
            print(len(addresses_that_sent_ADA),addresses_that_sent_ADA)
            if (len(addresses_that_sent_ADA)>0):
                ProcessInputs(addresses_that_sent_ADA)
            addresses_that_sent_ADA.clear()
            
            with open("code/satisfied_till_block.txt", 'w') as t:
                t.write(str(satisfied_till_block))
            t.close()
            with open("code/satisfied_till_index.txt", 'w') as m:
                m.write(str(tx_index_last+1))
            m.close()

            
        else:
            print("No new transactions found after the block you specified", start_block)
    except ApiError as e:
        print(e)
    