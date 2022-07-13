## Pricing Endpoint:
- Ordering system sends the university locationCode (ETS Reporting Code, listed below), the deliveryAddress (Where the order is going to be delivered to), and the diningAddress (Where the order is originating from) to the /pricing endpoint in a GET method.
- The API will respond with:
    - id (String, The orderID to be passed in later queries for the same order)
    - diningAddress (String, Confirmation of receipt)
    - deliveryAddress (String, Confirmation of receipt)
    - deliveryCost (Number, Cost of delivery order)
- If any of the above information is incorrect and needs to be resubmitted, the original /pricing API must be called with the new data.

## Current Location Codes
- Rochester Institute of Technology: 2760

## Order Endpoint:
- Ordering system must send the following json formatted information inside the request body to the /order endpoint in a POST method:
    - id (String, from /pricing endpoint)
    - customerName (String)
    - customerPhone (Integer)
    - customerInstructions (String)
- The API will respond with:
    - orderID (String)
    - orderAccepted (Boolean)

## Status Endpoint:
- Ordering system must send the following json formatted information inside the request body to the /order endpoint in a GET method:
    - id (String, from /pricing endpoint)
- The API will respond with:
    - orderID (String)
    - dasherAssigned (Boolean, whether a driver has accepted the order)
    - acceptTime (Date, the timestamp (if exists) that the driver accepted the order)
    - orderComplete (Boolean, whether the order has been dropped off and marked as complete)