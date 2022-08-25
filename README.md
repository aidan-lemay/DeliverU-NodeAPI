## Pricing Endpoint (/pricing)
- Request Body:
```
{
    "locationCode": {Integer, university ETS reporting code (see below)},
    "diningAddress": "{String address of where the delivery will be coming from}",
    "deliveryAddress": "{String address of where the delivery will be going to}"
}
```
- Response Body:
```
{
    "id": "{String order ID to be passed in future queries regarding this order}",
    "diningAddress": "Confirmation of the pickup location",
    "deliveryAddress": "Confirmation of the delivery location",
    "orderCost": {Integer, pickup cost to be charged to customer}
}
```

## Current Location Codes
- Rochester Institute of Technology: 2760
- University of North Carolina, Chapel Hill: 5816

## Order Endpoint (/order)
- Request Body:
```
{
    "id": "{String, value from /pricing of the order you want to place}",
    "data": {
        "customerName": "{String, name of customer for delivery}",
        "customerPhone": {Integer, customers 10 digit phone number},
        "customerInstructions": "{String, any special instructions from the customer for delivery. Can be empty but must be included.}"
    }
    
}
```
- Response Body:
```
{
    "id": "{String, confirmation of submitted order ID to be used in future calls}",
    "orderAccepted": "{Boolean, whether or not the order was accepted and assigned to a runner}"
}
```

## Status Endpoint (/status)
- Request Body:
```
{
    "id": "{String, value from /pricing or /order of the order you want updated status on}"
}
```
- Response Body:
```
{
    "orderID": "{String, confirmation of submitted order ID}",
    "dasherAssigned": {Boolean, whether or not someone has been assigned to the pickup order},
    "acceptTime": {Datetime, the time the order was accepted by a runner},
    "orderComplete": {Boolean, whether the order has been dropped off and marked as completed},
    "completeTime": {Datetime, the time the order was dropped and marked as completed by a runner}
}
```