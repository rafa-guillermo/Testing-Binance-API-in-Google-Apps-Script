function main() {
    const apiKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    const apiSecret = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
    const baseUrl = "https://api.binance.com"
    const endpoint = "/api/v3/allOrders"
    const timestamp = Number(new Date().getTime()).toFixed(0)
    const string = "symbol=LTCBTC&timestamp=" + timestamp


    let signature = Utilities.computeHmacSha256Signature(string, apiSecret)
    signature = signature.map(function(x) {
        const val = (x < 0 ? x + 256 : x).toString(16)
        return val.length == 1 ? "0" + val : val
    }).join("")

    const query = "?" + string + "&signature=" + signature
    const params = {
        'method': 'get',
        'headers': {'X-MBX-APIKEY': apiKey},
        'muteHttpExceptions': true
    }
    const response = UrlFetchApp.fetch(`${baseUrl}${endpoint}${query}`, params)
    console.log(response.getContentText())
}
