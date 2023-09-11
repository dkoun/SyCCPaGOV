from pycardano import Address, Network, PaymentSigningKey, PaymentVerificationKey
import os
  
# checking if the directory demo_folder 
# exist or not.
if not os.path.exists("keys"):
      
    # if the demo_folder directory is not present 
    # then create it.
    os.makedirs("keys")
payment_signing_key = PaymentSigningKey.generate()
payment_signing_key.save("keys/payment.skey")
payment_verification_key = PaymentVerificationKey.from_signing_key(payment_signing_key)
payment_verification_key.save("keys/payment.vkey")

network = Network.TESTNET
address = Address(payment_part=payment_verification_key.hash(), network=network)

f = open("keys/address.txt", "w+")
f.write(str(address))
f.close()