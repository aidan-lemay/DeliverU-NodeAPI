# API Endpoint Integration Instructions
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
    "orderCost": {Float, pickup cost to be charged to customer}
}
```

## Current Location Codes
- Rochester Institute of Technology: 2760
- University of North Carolina, Chapel Hill: 5816

## Get Price Endpoint (/getPrice)
- Request Body:
```
{
    "id": "{String, value from /pricing of the order you want pricing information from}"
}
```
- Response Body:
{
    "id": "{String, confirmation of submitted order ID to be used in future calls}",
    "orderCost": {Float, pickup cost to be charged to customer}
}

## Order Endpoint (/order)
- Request Body:
```
{
    "id": "{String, value from /pricing of the order you want to place}",
    "data": {
        "mobileOrderNumber": {Integer, order number provided by mobile ordering system},
        "roomNumber": "{String, room location inside of delivery location}",
        "customerName": "{String, name of customer for delivery}",
        "customerPhone": {String, customers 10 digit phone number},
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
    "runnerAssigned": {Boolean, whether or not someone has been assigned to the pickup order},
    "acceptTime": {Datetime, the time the order was accepted by a runner},
    "orderComplete": {Boolean, whether the order has been dropped off and marked as completed},
    "completeTime": {Datetime, the time the order was dropped and marked as completed by a runner}
}
```

# Instructions for Adding a new School
## In the API Repository:
- Find the ETS reporting code of the school you would like to add
- Inside of routes/order.js, add the school with the ETS code as the key name and the channel ID's of the requested Discord channels in the same format as the existing schools inside the channels array on line 11

## In the Python Control Repository:
- Inside of control.py, on line 35, add the schools ETS code and name in the variable following the existing format
- On line 59, add the location codes as "and" parameters in the same format as what exists
- Inside of storage.py (Must be created manually, not tracked by GitHub), add the ETS code and requested variables from Discord and Twillio in the same format as existing

## In the MongoDB Database:
- Inside of the locationCodes collection, add the ETS code, name of the school, and a primary central address to compare all future delivery addresses to
