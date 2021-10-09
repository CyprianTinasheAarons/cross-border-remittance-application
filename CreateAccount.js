const StellarSdk = require("stellar-sdk");

const server = new StellarSdk.Server("http://localhost:8000", {
  allowHttp: true,
});
const passphrase = "Standalone Network ; February 2017";

const MasterKey = StellarSdk.Keypair.master(passphrase);

const MasterSecret = MasterKey.secret();
const MasterPublicKey = MasterKey.publicKey();

console.log("Master Account", MasterSecret, MasterPublicKey);

const pair1 = StellarSdk.Keypair.random(passphrase);
const pair2 = StellarSdk.Keypair.random(passphrase);
const pair3 = StellarSdk.Keypair.random(passphrase);

let SecretKey1 = pair1.secret();
let PublicKey1 = pair1.publicKey();

console.log("Account1", SecretKey1, PublicKey1);

let SecretKey2 = pair2.secret();
let PublicKey2 = pair2.publicKey();

console.log("Account2", SecretKey2, PublicKey2);

let SecretKey3 = pair3.secret();
let PublicKey3 = pair3.publicKey();

console.log("Account3", SecretKey3, PublicKey3);

(async function main() {
  const account = await server.loadAccount(MasterPublicKey);
  const fee = await server.fetchBaseFee();
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee,
    networkPassphrase: passphrase,
  })
    .addOperation(
      StellarSdk.Operation.createAccount({
        source: MasterPublicKey,
        destination: PublicKey1,
        startingBalance: "100000",
      })
    )
    .addOperation(
      StellarSdk.Operation.createAccount({
        source: MasterPublicKey,
        destination: PublicKey2,
        startingBalance: "100000",
      })
    )
    .addOperation(
      StellarSdk.Operation.createAccount({
        source: MasterPublicKey,
        destination: PublicKey3,
        startingBalance: "100000",
      })
    )
    .setTimeout(30)
    .build();

  transaction.sign(MasterKey);

  try {
    const transactionResult = await server.submitTransaction(transaction);
    console.log(transactionResult);
  } catch (err) {
    console.log(err);
  }
})();
