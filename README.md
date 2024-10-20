# Tool usage instructions

twitter:@ApeMonkey_

#### Required before use：

```
node v20.10.0
npm 10.5.0
```

#### Installation process：

```
git clone https://github.com/TheApeMonkeys/MintApeMonkeyTool

npm install
```

After the toolkit is installed, please complete the``` .env``` file content

> MAIN_ACCOUNT_ADDRESS This is the main address assigned to the wallet and where your initial funds should be placed.
> 
> MAIN_ACCOUNT_PRIVATE_KEY This is the corresponding address private key.
> 
> APE_MONKEY_CA is 0x64BCB6DBFe9703cdb786080ae05029d1561726Af

###### mint command is:

`node main mint --feerate 25.42069 --sendvalue 0.004`

###### collect command:

`node main collect --feerate 25.42069`

###### more help: `node main -h`

```
Usage: main [options] [command]

Options:
  -h, --help         display help for command

Commands:
  mint [options]     Generate address, distribute fund and mint token
  collect [options]  Collect all tokens and eth
  help [command]     display help for command
```

Give me a cup of coffee: 0x606c67849FF7F6323bd46908971B17781EbBc3A2

🐒🐒🐒