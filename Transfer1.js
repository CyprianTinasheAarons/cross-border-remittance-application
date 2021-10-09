const StellarSdk = require("stellar-sdk");

const server = new StellarSdk.Server("http://localhost:8000", {
  allowHttp: true,
});

let issuingKeys = StellarSdk.Keypair.fromSecret(
  "SC5O7VZUXDJ6JBDSZ74DSERXL7W3Y5LTOAMRF7RQRL3TAGAPS7LUVG3L"
);
let receivingKeys1 = StellarSdk.Keypair.fromSecret(
  "SAY2CYK54WTYB6MMIS6TJTDE52DSNCVADX2SLRNMAABCTDLFOCKYOLOR"
);
let receivingKeys2 = StellarSdk.Keypair.fromSecret(
  "SDDSNCBXKIFR373FOSZGEQRUIFVZDHISNKKRY7ESILMT2WHIF44RBIFM"
);

let USD = new StellarSdk.Asset(
  "USD",
  "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"
);

server.fetchBaseFee().then((fee) => {
  console.log("Fee is", fee);
  server.loadAccount(issuingKeys.publicKey()).then((account) => {
    let transaction = new StellarSdk.TransactionBuilder(account, {
      fee,
      networkPassphrase: "Standalone Network ; February 2017",
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: receivingKeys1.publicKey(),
          asset: USD,
          amount: "1000",
        })
      )
      .setTimeout(100)
      .build();

    transaction.sign(issuingKeys);
    return server.submitTransaction(transaction).then((response, error) => {
      console.log(response);
      console.log(error);
    });
  });
});
