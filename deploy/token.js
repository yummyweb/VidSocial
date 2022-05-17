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

async function main() {
	const client = Client.forTestnet().setOperator(operatorId, operatorKey);

	console.log("- Creating token");

	const tokenCreateTx = new TokenCreateTransaction()
		.setTokenName("VidSocialToken")
		.setTokenSymbol("VST")
        .setTokenType(TokenType.NonFungibleUnique)
		.setTreasuryAccountId(operatorId)
		.setInitialSupply(0)
		.setDecimals(0)
		.setSupplyKey(operatorKey)
		.freezeWith(client);
	const tokenCreateSign = await tokenCreateTx.sign(operatorKey);
	const tokenCreateSubmit = await tokenCreateSign.execute(client);
	const tokenCreateRec = await tokenCreateSubmit.getRecord(client);
	const tId = tokenCreateRec.receipt.tokenId;
	const supply = tokenCreateTx._initialSupply.low;
    console.log(tId)
    console.log(supply)

	return [tId, supply];
}

main()