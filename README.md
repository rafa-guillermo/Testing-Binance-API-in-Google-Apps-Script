# GAS Binance API Testing Script

### Objective:
Use Google Apps Script to connect to the Binance API with the aim of obtaining public and private resources.

### Issues:
- Requests blocked by Web Application Firewall due to too many requests from the Google Apps Script API pool.

### Testing Wave 1:
- Created new Google Apps Script project with script contained within `code.js`. 
- Created an Binance application to obtain an API key and API secret, which were used in `Code.gs` in place of the placeholder values.
- Ran script multiple times with varying delays.

### Wave 1 Results:
- First 3 requests resulted in HTTP 403 Web Application Firewall error page with "The request could not be satisfied" as per [`request-not-satisfied.html`](https://github.com/rafa-guillermo/GAS-Binance-API-Test/blob/main/executionLogs/allOrders.txt)
- Subsequent requests resulted in either the above response page, or HTTP 418 with message `IP banned until X` where `X` is a Unix timestamp approximately 75 minutes after the request was made.

### Testing Wave 2:
- Created exponential backoff algorithm based on recommendation from [Google IoT Core documentation](https://cloud.google.com/iot/docs/how-tos/exponential-backoff?hl=es#example_algorithm)
- Ran 50 requests using this algorithm.

### Wave 2 Results:
- 41 `HTTP 418` responses were received
- 4 `HTTP 403` responses were received
- 7 empty responses were received (´[]´)
- As empty responses with HTTP 200 were received it seems that it is occasionally possible to retrieve data from the API in Google Apps Script.
- Testing a third wave using an endpoint that I can be sure will have data.

### Testing Wave 3:
- Modularised code to make generic calls.
- Created function to call Account Information endpoint (https://api.binance.com/api/v3/account)
- Ran 50 requests to this endpoint

### Wave 3 Results:
- 46 `HTTP 418` responses were received
- 4 requests were made successfully with correct response (execution log [here](https://github.com/rafa-guillermo/GAS-Binance-API-Test/blob/main/executionLogs/accountInformation.txt).

### Analysis:
- Response success rate is approximately 9.6%:
  - 250 requests were sent in 5 batches of 50 (successful responses per batch: 4, 7, 7, 0, 6)
  - Count, N   : 5
  - Sum, Σx    : 24 ( /250)
  - Mean, x̄    : 4.8
  - Variance, s<sup>2</sup>: 8.7

Using Binomial Probability:
- There is **`~63.5%`** chance of a sucessful response **within 10 requests**.
- Probability goes up to **`86.7%` with 20 trials** for at least one success.
- Probability of a successful response in **50 trials** goes up again to **`99.2%`**.

### Conclusion:
- Using well formed Exponential Backoff algorithms can generate responses from the Binance API with enough attempts
- GAS is not the most reliable platform, using backoff algoithm executes 50 requests in ~70 seconds 
- Assuming no additional quota issues or usage limits a successful response can be received with **attenuation towards certain chance**.
