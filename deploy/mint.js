require("dotenv").config();
const {
	Client,
	AccountId,
	PrivateKey,
	TokenCreateTransaction,
	TokenMintTransaction,
	FileCreateTransaction,
	ContractCreateTransaction,
	ContractFunctionParameters,
	ContractExecuteTransaction,
	TokenInfoQuery,
	AccountBalanceQuery,
	Hbar,
	TokenType,
} = require("@hashgraph/sdk")

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const tId = "0.0.34279957"

async function main() {
	const client = Client.forTestnet().setOperator(operatorId, operatorKey);

	console.log("- Minting new tokens!");
	const tokenMintTx = new TokenMintTransaction().setTokenId(tId).setMetadata([Buffer.from("bafkreifr2eafwfg6zipndydyowgx7qg5telxjc2g64nqxyllitcxxuairq")]).freezeWith(client);
	const tokenMintSign = await tokenMintTx.sign(operatorKey);
	const tokenMintSubmit = await tokenMintSign.execute(client);
	const tokenMintRec = await tokenMintSubmit.getRecord(client);
	const supply = tokenMintRec.receipt.totalSupply;
    console.log(supply)
}

main()