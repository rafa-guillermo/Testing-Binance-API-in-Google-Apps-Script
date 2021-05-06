function main() {
    const apiKey = "IMTpWuq28fQANXSILgih9U4dub3AYcWRMo2j6utbuvswDktAnK0fY3fsRh9au1D1"
    const apiSecret = "DKj1oK9RRKj4WkeMG7kAJws7liAKU54e7liW4Gs5Dt6Vpf21A9PIvKASRjN1kgpS"
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
