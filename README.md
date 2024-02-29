# CAT API TOOL
CAT API Tool is a tool for configuring sandbox merchants.
The tool is not intended to replace CAT.
Default configurations are therefore applied. If you need to make a specific configuration, you will have to use CAT.

# Features
CAT API Tool lets you add entities to an existing merchant, add processing channels to an existing entity or add payment methods to a processing channel.

Adding a new entity automatically creates the pricing profile and the APM pricing profile.

Adding a new processing channel will automatically add un currency account par processing channel, create a routing payment rules, create a routing payout rules, and create a payout schedule.

Adding a new payment method will automatically create the processing profile and the processing processor (if need the authentication processor too).

Supported Legal entities : 
- Checkout LTD
- Checkout SAS

Supported Payment methods : 
- Visa
- Mastercard
- Cartes Bancaires
- Bancontact
- Ideal
- SEPA
- Giropay
- Amex

# Install
- Download the Github repo
- Type in terminal :
```bash 
cd CAT_API
```
- Then type : 
```bash 
npm -i
```

# Run 
- Make sure you are connected to the VPN 
- run the following command in the project directory : "npm run dev"
- Once the command has been entered in the terminal, it will display the local host URL to display the front-end. It should look like this: "http://localhost:5173/"
- The vast majority of operations will be displayed in the terminal. In the event of an error, this should also be displayed in the terminal.

# Access with postman : 
You can also directly access the back-end with postman for example. 
The server run on http://127.0.0.1:4000.
There is 2 endpoints : 
- http://127.0.0.1:4000/CatAPI/ConfigureMerchant/ --> Allow to add entity, processing channels and payment methods
- http://127.0.0.1:4000/CatAPI/GetMerchantConf/ --> Allow to get the actual configuration

Payload example : 
- GetMerchantConf : 
```json
{
    "Bearer": "Bearer token",
    "ClientId": "cli_d2s6xmrsuezerh3uvt2utdui24",
    "delay":1
}
```
- ConfigureMerchant : 
```json
{
    "Bearer": "Bearer token",
    "ClientId": "cli_d2s6xmrsuezerh3uvt2utdui24",
    "delay": 1,
    "Entity": [
        {
            "EntityName": "{{$randomJobTitle}}",
            "LegalEntity": "cko-sas",
            "Processing_channel": [
                {
                    "ProcessingChannelName": "{{$randomFirstName}}",
                    "PaymentMethod": [
                        "CARTES_BANCAIRES",
                        "VISA",
                        "MASTERCARD",
                        "IDEAL",
                        "BANCONTACT"
                    ]
                }
            ]
        },
        {
            "EntityName": "{{$randomJobTitle}}",
            "LegalEntity": "cko-sas",
            "Processing_channel": [
                {
                    "ProcessingChannelName": "{{$randomFirstName}}",
                    "PaymentMethod": [
                        "CARTES_BANCAIRES",
                        "VISA",
                        "MASTERCARD",
                        "IDEAL",
                        "BANCONTACT"
                    ]
                }
            ]
        },
        {
            "EntityName": "{{$randomStreetName}}",
            "LegalEntity": "cko-ltd-uk",
            "Processing_channel": [
                {
                    "ProcessingChannelName": "{{$randomFirstName}}",
                    "PaymentMethod": [
                        "CARTES_BANCAIRES",
                        "VISA",
                        "MASTERCARD"
                    ]
                },
                {
                    "ProcessingChannelName": "{{$randomLastName}}",
                    "PaymentMethod": [
                        "CARTES_BANCAIRES",
                        "VISA",
                        "MASTERCARD",
                        "IDEAL",
                        "SEPA"
                    ]
                }
            ]
        },
        {
            "EntityID": "ent_mdhojpaola6trtj5ouftufrv5i",
            "Processing_channel": [
                {
                    "ProcessingChannelID": "pc_vhcmnqam54qunmfx3euzjimesu",
                    "PaymentMethod": [
                        "VISA",
                        "MASTERCARD",
                        "IDEAL",
                        "BANCONTACT"
                    ]
                },
                {
                    "ProcessingChannelName": "{{$randomLastName}}",
                    "PaymentMethod": [
                        "CARTES_BANCAIRES",
                        "VISA",
                        "MASTERCARD",
                        "IDEAL",
                        "SEPA"
                    ]
                }
            ]
        }
    ]
}
```

# Disclaimer : 
- The tool will not check (apart for CB) if the payment method is avalaible with the CKO legal entity or the currency used in the entity. You may need to verify the country or currency needed for the payement method before adding it
- If your connection is not stable, some requests may not be successful. This will make it impossible to configure all the elements correctly, or will result in a partial configuration.
- This tool is in Alpha version, which means that bugs may occur. Bear in mind that it is impossible to delete a configuration on CAT. So any modification will be irreversible.
- This tool does not check for duplicates. If you try to create the same processing channel 3 times, it will be created 3 times.
