const apiKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
const apiSecret = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"

function generateSugnature(string) {
  let signature = Utilities.computeHmacSha256Signature(string, apiSecret)
  return signature.map(function(x) {
    const val = (x < 0 ? x + 256 : x).toString(16)
    return val.length == 1 ? "0" + val : val
  }).join("")
}

function makeApiCall(endpoint, string) {    
  const timestamp = Number(new Date().getTime()).toFixed(0)
  string = string + timestamp  
  const signature = generateSugnature(string)
  
  
  const query = "?" + string + "&signature=" + signature
  const params = {
    'method': 'get',
    'headers': {'X-MBX-APIKEY': apiKey},
  }
  const response = UrlFetchApp.fetch(`${endpoint}${query}`, params)
  console.log(response.getContentText())
}

function exponentialBackoff(url, string) {
  for (let count = 0; count < 50; count++) {
    try {
      Utilities.sleep((count * count) + (Math.random() * 1000))
      makeApiCall(url, string)
    }    
    catch(e) {
      console.info(e)
      continue
    }
  }
}

function allOrders() {
  // makeApiCall(Binance.Endpoint.ALL_ORDERS, "symbol=LTCBTC&timestamp=")
  exponentialBackoff(Binance.Endpoint.ALL_ORDERS, "symbol=LTCBTC&timestamp=")
}

function accountInformation() {
  // makeApiCall(Binance.Endpoint.ACCOUNT_INFORMATION, "")
  exponentialBackoff(Binance.Endpoint.ACCOUNT_INFORMATION, "timestamp=")
}
