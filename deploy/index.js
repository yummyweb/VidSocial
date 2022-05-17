require("dotenv").config();
const {
	AccountId,
	PrivateKey,
	Client,
	FileCreateTransaction,
	ContractCreateTransaction,
	ContractFunctionParameters,
	ContractExecuteTransaction,
	ContractCallQuery,
	Hbar,
    FileAppendTransaction
} = require("@hashgraph/sdk");
const fs = require("fs");
const Web3 = require("web3");

const web3 = new Web3;

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

let abi;
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
client.setDefaultMaxTransactionFee(new Hbar(3));
client.setMaxQueryPayment(new Hbar(1));

async function main() {
	// Import the compiled contract bytecode
	const contractBytecode = fs.readFileSync("Contract_sol_Contract.bin");
    abi = JSON.parse(fs.readFileSync('Contract_sol_Contract.abi', 'utf8'));

	// Create a file on Hedera and store the bytecode
    const contractBytecodeMiddle = Math.floor(contractBytecode.length / 2);
	const fileCreateTx = new FileCreateTransaction()
		.setContents(contractBytecode.slice(0, contractBytecodeMiddle))
		.setKeys([operatorKey])
		.freezeWith(client)

	const fileCreateSign = await fileCreateTx.sign(operatorKey);
	const fileCreateSubmit = await fileCreateSign.execute(client);
	const fileCreateRx = await fileCreateSubmit.getReceipt(client);
	const bytecodeFileId = fileCreateRx.fileId;

    const appendedFile = await new FileAppendTransaction()
        .setFileId(bytecodeFileId)
		.setContents(contractBytecode.slice(contractBytecodeMiddle))
        .setMaxTransactionFee(new Hbar(5))
		.freezeWith(client);

    const appendedFileSign = await appendedFile.sign(operatorKey);
    const appendedFileSubmit = await appendedFileSign.execute(client);
    const appendedFileRx = await appendedFileSubmit.getReceipt(client);

	console.log(`- The bytecode file ID is: ${bytecodeFileId} \n`);

	// Instantiate the smart contract
	const contractInstantiateTx = new ContractCreateTransaction()
		.setBytecodeFileId(bytecodeFileId)
		.setGas(100000)
	const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
	const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
	const contractId = contractInstantiateRx.contractId;
	const contractAddress = contractId.toSolidityAddress();
	console.log(`- The smart contract ID is: ${contractId} \n`);
	console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

	// Create a new video
	const contractExecuteTx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(1000000)
		.setFunction(
            "uploadVideo",
            new ContractFunctionParameters().addString("ipfs-hash").addString("my-video").addString("some-issue") 
        );
	const contractExecuteSubmit = await contractExecuteTx.execute(client);
    const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
    console.log(`- Contract function call status: ${contractExecuteRx.status} \n`);

	// Call contract function to query the state variable
	const contractQueryTx = new ContractCallQuery()
		.setContractId(contractId)
        .setQueryPayment(new Hbar("0.06")) 
		.setGas(100000)
		.setFunction("getVideo", new ContractFunctionParameters().addUint256(1))
	const contractQuerySubmit = await contractQueryTx.execute(client);
    console.log(decodeFunctionResult("getVideo", contractQuerySubmit.bytes)["0"]);

	// Call contract function to update the state variable
	const contractQueryTx_ = new ContractCallQuery()
		.setContractId(contractId)
		.setGas(100000)
		.setFunction("totalVideos")
		.setMaxQueryPayment(new Hbar(0.00000001));
	const contractQuerySubmit_ = await contractQueryTx_.execute(client);
	const contractQueryResult = contractQuerySubmit_.getUint256(0);
    console.log(`- Total number of videos: ${contractQueryResult} \n`);
}

function decodeFunctionResult(functionName, resultAsBytes) {
    const functionAbi = abi.find(func => func.name === functionName);
    const functionParameters = functionAbi.outputs;
    const resultHex = '0x'.concat(Buffer.from(resultAsBytes).toString('hex'));
    const result = web3.eth.abi.decodeParameters(functionParameters, resultHex);
    return result;
}

main();