from pycardano import *
import pathlib
import os
import json
from dotenv import load_dotenv
from blockfrost import ApiUrls, ApiError
load_dotenv()

blockfrost_key = os.getenv("BLOCK_FROST_KEY")


NETWORK = Network.TESTNET

"""Preparation"""
# Define the root directory where images and keys will be stored.
PROJECT_ROOT = ""
root = pathlib.Path(PROJECT_ROOT)

# Create the directory if it doesn't exist
root.mkdir(parents=True, exist_ok=True)
key_dir = root / "keys"
key_dir.mkdir(exist_ok=True)


# Load payment keys or create them if they don't exist
def load_or_create_key_pair(base_dir, base_name):
    skey_path = base_dir / f"{base_name}.skey"
    vkey_path = base_dir / f"{base_name}.vkey"


    if skey_path.exists():
        skey = PaymentSigningKey.load(str(skey_path))
        vkey = PaymentVerificationKey.from_signing_key(skey)
        print("Found keys")
        if base_name == "policy":
            print("I shouldn't be here because a policy has already been created")
            exit()
    else:
        print("Creating..")
        key_pair = PaymentKeyPair.generate()
        key_pair.signing_key.save(str(skey_path))
        key_pair.verification_key.save(str(vkey_path))
        skey = key_pair.signing_key
        vkey = key_pair.verification_key
    return skey, vkey


# Payment address. Send some ADA (~5 ADA is enough) to this address, so we can pay the minting fee later.
payment_skey, payment_vkey = load_or_create_key_pair(key_dir, "payment")

address = Address(payment_vkey.hash(), network=NETWORK)


# Generate policy keys, which will be used when minting NFT
policy_skey, policy_vkey = load_or_create_key_pair(key_dir, "policy")

# A policy that requires a signature from the policy key we generated above
pub_key_policy = ScriptPubkey(policy_vkey.hash())



# A time policy that disallows token minting after ~1 year from last block
chain_context = BlockFrostChainContext(
           project_id=blockfrost_key,
            base_url=ApiUrls.preprod.value,
            )
must_before_slot = InvalidHereAfter(chain_context.last_block_slot + 10*30000000) #1 year locked-policy

#must_before_slot = InvalidHereAfter(84400856 + 10000000)
#print(chain_context.last_block_slot)

# Combine two policies using ScriptAll policy
policy = ScriptAll([pub_key_policy, must_before_slot])
#with open(root / "policy.script", "r") as r:
#    policy = (r.read())


#policy = ScriptAll(policy)
# Calculate policy ID, which is the hash of the policy
policy_id = policy.hash()
json_object = json.dumps(policy.to_dict())

with open(root / "keys/policy.id", "a+") as f:
    f.truncate(0)
    f.write(str(policy_id))
with open(root / "keys/policy.script", "a+") as h:
    h.write(json_object)
print(json_object)