import {
	AccountId,
	PrivateKey,
	Client,
	ContractFunctionParameters,
	ContractExecuteTransaction,
    ContractCallQuery,
	Hbar,
    TransactionReceipt,
    TokenId,
    TransactionId
} from "@hashgraph/sdk";
import Web3 from "web3";
import { getHashConnect } from "../hooks/HashConnectAPIProvider";

const web3 = new Web3;
const contract = "0.0.34274749"

export async function createVideo(ipfsHash, title, issue) {
    const operatorId = AccountId.fromString("0.0.34202240");
    const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420c0bce985953422c79e7294f2fc0a704b978e9f2788e50a02fcc19ced99742a6c");
    const walletId = loadLocalData()["accountIds"][0]
    const topic = loadLocalData()["topic"]
    const hashConnect = getHashConnect()

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    client.setDefaultMaxTransactionFee(new Hbar(3));
    client.setMaxQueryPayment(new Hbar(1));

	const trans = new ContractExecuteTransaction()
		.setContractId(contract)
		.setGas(1000000)
		.setFunction(
            "uploadVideo",
            new ContractFunctionParameters().addString(ipfsHash).addString(title).addString(issue) 
        );
    
	makeBytes(trans, walletId)
    .then(async transactionBytes => {
        const res = await hashConnect.sendTransaction(topic, {
            byteArray: transactionBytes,
            topic,
            metadata: {
                accountToSign: walletId,
                returnTransaction: false
            }
        })

        let responseData = {
            response: res,
            receipt: null
        }

        if (res.success) responseData.receipt = TransactionReceipt.fromBytes(res.receipt);
        console.log(responseData)
        console.log(res)
    })
}

export async function getAllVideos() {
    const operatorId = AccountId.fromString("0.0.34202240");
    const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420c0bce985953422c79e7294f2fc0a704b978e9f2788e50a02fcc19ced99742a6c");

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    client.setDefaultMaxTransactionFee(new Hbar(3));
    client.setMaxQueryPayment(new Hbar(1));

	const contractQueryTx_ = new ContractCallQuery()
		.setContractId(contract)
		.setGas(100000)
		.setFunction("totalVideos")
		.setMaxQueryPayment(new Hbar(1));
	const contractQuerySubmit_ = await contractQueryTx_.execute(client);
	const contractQueryResult = contractQuerySubmit_.getUint256(0);

    let result = []

    for (let i = contractQueryResult; i >= 1; i--) {
        const contractQueryTx = new ContractCallQuery()
            .setContractId(contract)
            .setQueryPayment(new Hbar("0.06")) 
            .setGas(100000)
            .setFunction("getVideo", new ContractFunctionParameters().addUint256(i))
	    const contractQuerySubmit = await contractQueryTx.execute(client);
        result.push({
            id: decodeFunctionResult("getVideo", contractQuerySubmit.bytes)["0"]["id"],
            hash: decodeFunctionResult("getVideo", contractQuerySubmit.bytes)["0"]["hash"],
            title: decodeFunctionResult("getVideo", contractQuerySubmit.bytes)["0"]["title"],
            issue: decodeFunctionResult("getVideo", contractQuerySubmit.bytes)["0"]["issue"],
            likes: decodeFunctionResult("getVideo", contractQuerySubmit.bytes)["0"]["likes"],
            author: TokenId.fromSolidityAddress(decodeFunctionResult("getVideo", contractQuerySubmit.bytes)["0"]["author"]),
            timestamp: decodeFunctionResult("getVideo", contractQuerySubmit.bytes)["0"]["time"]
        })
    }

    return result
}

export async function likeVideo(id) {
    const operatorId = AccountId.fromString("0.0.34202240");
    const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420c0bce985953422c79e7294f2fc0a704b978e9f2788e50a02fcc19ced99742a6c");

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    client.setDefaultMaxTransactionFee(new Hbar(3));
    client.setMaxQueryPayment(new Hbar(1));

	const contractExecuteTx = new ContractExecuteTransaction()
		.setContractId(contract)
		.setGas(1000000)
		.setFunction(
            "likeVideo",
            new ContractFunctionParameters().addUint256(id)
        );
	const contractQuerySubmit_ = await contractExecuteTx.execute(client);
}

// LOCAL FUNCTIONS
function decodeFunctionResult(functionName, resultAsBytes) {
    const abi = JSON.parse('[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"string","name":"hash","type":"string"},{"indexed":false,"internalType":"string","name":"title","type":"string"},{"indexed":false,"internalType":"string","name":"issue","type":"string"},{"indexed":false,"internalType":"int256","name":"likes","type":"int256"},{"indexed":false,"internalType":"address","name":"author","type":"address"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"VideoUploaded","type":"event"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getVideo","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"hash","type":"string"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"issue","type":"string"},{"internalType":"int256","name":"likes","type":"int256"},{"internalType":"address","name":"author","type":"address"},{"internalType":"uint256","name":"time","type":"uint256"}],"internalType":"struct Contract.Video","name":"","type":"tuple"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"likeVideo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalVideos","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_videoHash","type":"string"},{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_issue","type":"string"}],"name":"uploadVideo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"videoCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"videos","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"hash","type":"string"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"issue","type":"string"},{"internalType":"int256","name":"likes","type":"int256"},{"internalType":"address","name":"author","type":"address"},{"internalType":"uint256","name":"time","type":"uint256"}],"stateMutability":"view","type":"function"}]')

    const functionAbi = abi.find(func => func.name === functionName);
    const functionParameters = functionAbi.outputs;
    const resultHex = '0x'.concat(Buffer.from(resultAsBytes).toString('hex'));
    const result = web3.eth.abi.decodeParameters(functionParameters, resultHex);
    return result;
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