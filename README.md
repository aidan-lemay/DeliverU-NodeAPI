## Pricing Endpoint:
- Ordering system sends the university locationCode (ETS Reporting Code, listed below), the deliveryAddress (Where the order is going to be delivered to), and the diningAddress (Where the order is originating from) to the /pricing endpoint in a GET method.
- The API will respond with:
    - The orderID (_id)
    - Whether or not the order is able to be accepted (acceptableOrder, Boolean)
    - The estimated cost of delivery (deliveryCost)

## Current Location Codes
- Rochester Institute of Technology: 2760

## Order Endpoint:
- Ordering system sends the _id value returned from /pricing in the request parameters as "id", and the following json formatted information inside the request body to the /order endpoint in a POST method:
    - customerName (String)
    - customerPhone (Integer)
    - customerInstructions (String)
- The API will respond with:
    - orderID
    - acceptableOrder (Boolean)

## Scratch Notes
- Discord integration: When driver reacts to message, they are given a "Clocked-In" role and access to the "New Orders" channel. When an order is sent in, the role is pinged inside the channel. When the order is claimed (through message reactions), the message is deleted and moved into a "Current Orders" channel