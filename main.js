const Web3 = require('web3');
const { Command } = require('commander');
const web3 = new Web3('https://apechain.calderachain.xyz/http'); 
const fs = require('fs');
const program = new Command();
require('dotenv').config();
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;
const privateKey = process.env.MAIN_ACCOUNT_PRIVATE_KEY;
const address = process.env.MAIN_ACCOUNT_ADDRESS;
const token = process.env.APE_MONKEY_CA;
const tokenAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"MAX_MINTS_PER_BLOCK","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINT_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"daoAddress","type":"address"}],"name":"donate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"mintCountPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const customCommon = Common.forCustomChain(
    'mainnet',
    {
        name: 'APE Chain Mainnet',
        networkId: 33139,
        chainId: 33139
    },
    'istanbul',
);
if (!privateKey||!address||!token) {
  console.error('Error: Please configure the .env file correctly!');
  process.exit(1); 
}


const mintCommand = program.command('mint')
  .description('Generate address, distribute fund and mint token')
  .option('--feerate <gwei>', 'Set transaction rate')
  .option('--sendvalue <ether>', 'Amount of funds sent')
  .action(async (options) => {

    if(options.feerate && options.sendvalue)
    {
    	while(true)
    	{
    		try{
        		const [newaddress,newprivateKey] = await generateAddress();
    			await distribute(newaddress, options.sendvalue, options.feerate);
    			await mint(options.feerate,newaddress,newprivateKey.slice(2));		
    		}catch(error){
    			console.log(error.message)
    			process.exit(1);
    		}
    	}

    }else{
    	console.error('Error: Please enter the parameters correctly!');
  		process.exit(1); 
    }

  });

const collectCommand = program.command('collect')
  .description('Collect all tokens and eth')
  .option('--feerate <gwei>', 'Set transaction rate')
  .action(async (options) => {
    if (options.feerate) {
    	try{

    		const walletstring = fs.readFileSync('addresses.json');
    		addresses = JSON.parse('['+walletstring.slice(0, -1)+']');

    		for(let wallet of addresses)
    		{
    			await collecttoken(wallet.address, wallet.privateKey.slice(2),options.feerate);
    			await collectape(wallet.address, wallet.privateKey.slice(2),options.feerate);
    		}


    	}catch(error)
    	{
    		console.log(error.message)
    		process.exit(1); 
    	}

    }else{
      console.error('Error: Please enter the parameters correctly!');
  	  process.exit(1); 	
    }
  });

program.parse(process.argv);

async function generateAddress() {
  const newAccount = web3.eth.accounts.create();
  const newaddress = newAccount.address;
  const newprivateKey = newAccount.privateKey;
  const dataToSave = {
    address: newaddress,
    privateKey: newprivateKey
  };
  fs.appendFileSync('addresses.json', JSON.stringify(dataToSave) + ',');
  return [newaddress,newprivateKey];

}

async function distribute(newAddress, value, feerate) {
  const rawTx = {
  	nonce: await web3.eth.getTransactionCount(address),
    from: address,
    to: newAddress,
    value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
    gas: 21183, 
    gasPrice:web3.utils.toHex(web3.utils.toWei(feerate, 'gwei')),
  };

  try {
  	let DistributeTx = new Tx(rawTx, { 'common': customCommon });
    DistributeTx.sign(Buffer.from(privateKey, 'hex'));
    const result = await web3.eth.sendSignedTransaction('0x' + DistributeTx.serialize().toString('hex'));
    console.log("Distribute hash:",result.transactionHash)


  } catch (error) {
    throw new Error(`Distribute error: ${error.message}`)
  }
}

async function collectape(newaddress,newprivateKey,feerate) {


	const balanceWei = await web3.eth.getBalance(newaddress);
	if(balanceWei<=22000*web3.utils.toWei(feerate, 'gwei')){
		console.log(`${newaddress} ape balance is Zero`)
  		return;
	}
  	const rawTx = {
  	  nonce: await web3.eth.getTransactionCount(newaddress),
  	  from: newaddress,
  	  to: address,
  	  value: web3.utils.toHex(balanceWei-22000*web3.utils.toWei(feerate, 'gwei')),
  	  gas: 21183, 
  	  gasPrice:web3.utils.toHex(web3.utils.toWei(feerate, 'gwei')),
  	};

  try {
  	let CollectapeTx = new Tx(rawTx, { 'common': customCommon });
    CollectapeTx.sign(Buffer.from(newprivateKey, 'hex'));
    const result = await web3.eth.sendSignedTransaction('0x' + CollectapeTx.serialize().toString('hex'));
    console.log("Collectape hash:",result.transactionHash)

  } catch (error) {
    throw new Error(`Collectape error: ${error.message}`)
  }
}

async function mint(feerate,newaddress,newprivateKey) {
  const contract = new web3.eth.Contract(tokenAbi, token);
  
  const data = contract.methods['mint']().encodeABI();

  const rawTx = {
  	nonce: await web3.eth.getTransactionCount(newaddress),
    from: newaddress,
    to: token ,
    gas: 139958, 
    gasPrice:web3.utils.toHex(web3.utils.toWei(feerate, 'gwei')),
    data: data
  };

  try {
  	let MintTx = new Tx(rawTx, { 'common': customCommon });
    MintTx.sign(Buffer.from(newprivateKey, 'hex'));
    const result = await web3.eth.sendSignedTransaction('0x' + MintTx.serialize().toString('hex'));
    console.log("Mint hash:",result.transactionHash)
  } catch (error) {
    throw new Error(`Mint error: ${error.message}`)
  }
}



async function collecttoken(newaddress,newprivateKey,feerate) {
  const contract = new web3.eth.Contract(tokenAbi, token);
  const tokenBalance = await contract.methods.balanceOf(newaddress).call();
  if(tokenBalance==0) {
  	console.log(`${newaddress} token balance is Zero`)
  	return;
  }
  const data = contract.methods['transfer'](address,tokenBalance).encodeABI();

  const rawTx = {
  	nonce: await web3.eth.getTransactionCount(newaddress),
    from: newaddress,
    to: token ,
    gas: 57388, 
    gasPrice:web3.utils.toHex(web3.utils.toWei(feerate, 'gwei')),
    data: data
  };

  try {
  	let TransferTx = new Tx(rawTx, { 'common': customCommon });
    TransferTx.sign(Buffer.from(newprivateKey, 'hex'));
    const result = await web3.eth.sendSignedTransaction('0x' + TransferTx.serialize().toString('hex'));
    console.log("Transfer hash:",result.transactionHash)
  } catch (error) {
    throw new Error(`Transfer error: ${error.message}`)
  }
}