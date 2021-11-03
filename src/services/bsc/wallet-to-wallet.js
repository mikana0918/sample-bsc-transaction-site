const { BncClient } = require("@binance-chain/javascript-sdk")
const axios = require("axios")

const asset = "BNB" // asset string
const amount = 1.123 // amount float
const addressTo = "tbnb1hgm0p7khfk85zpz5v0j8wnej3a90w709zzlffd" // addressTo string
const message = "A note to you" // memo string
const api = "https://testnet-dex.binance.org/" /// api string

let privKey = "DEADBEEF" // privkey hexstring (keep this safe)

const bnbClient = new BncClient(api)
const httpClient = axios.create({ baseURL: api })

bnbClient.chooseNetwork("testnet") // or this can be "mainnet"
bnbClient.setPrivateKey(privKey)
bnbClient.initChain()

const addressFrom = bnbClient.getClientKeyAddress() // sender address string (e.g. bnb1...)
const sequenceURL = `${api}api/v1/account/${addressFrom}/sequence`

httpClient
  .get(sequenceURL)
  .then((res) => {
    const sequence = res.data.sequence || 0
    return bnbClient.transfer(
      addressFrom,
      addressTo,
      amount,
      asset,
      message,
      sequence
    )
  })
  .then((result) => {
    console.log(result)
    if (result.status === 200) {
      console.log("success", result.result[0].hash)
    } else {
      console.error("error", result)
    }
  })
  .catch((error) => {
    console.error("error", error)
  })