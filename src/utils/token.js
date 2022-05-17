import {
	AccountId,
	PrivateKey,
	Client,
	TokenMintTransaction,
    TransactionId,
    TransactionReceipt
} from "@hashgraph/sdk";
import Web3 from "web3";
import { getHashConnect } from "../hooks/HashConnectAPIProvider";

const web3 = new Web3;
const tId = "0.0.34279957"

export async function mintToken(cid) {
    const operatorId = AccountId.fromString("0.0.34202240");
    const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420c0bce985953422c79e7294f2fc0a704b978e9f2788e50a02fcc19ced99742a6c");
    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    const walletId = loadLocalData()["accountIds"][0]
    const topic = loadLocalData()["topic"]
    const hashConnect = getHashConnect()

    const tokenMintTx = await new TokenMintTransaction().setTokenId(tId).setAmount(1).setMetadata(Buffer.from([cid + "/metadata.json"]))
    
    makeBytes(tokenMintTx, walletId)
    .then(async transactionBytes => {
        const res = await hashConnect.sendTransaction(topic, {
            byteArray: transactionBytes,
            topic,
            metadata: {
                accountToSign: walletId,
                returnTransaction: true
            }
        })

        let responseData = {
            response: res,
            receipt: null
        }

        if (res.success) {
            return "SUCCESS"
        }
    })
}

async function makeBytes(trans, signingAcctId) {
    let transId = TransactionId.generate(signingAcctId)
    trans.setTransactionId(transId);
    trans.setNodeAccountIds([new AccountId(3)]);

    await trans.freeze();
    
    let transBytes = trans.toBytes();

    return transBytes;
}

const loadLocalData = () => {
    let foundData = localStorage.getItem("hashconnectData");
  
    if (foundData) {
      const saveData = JSON.parse(foundData);
      // setSaveData(saveData);
      return saveData;
    } else return null;
}