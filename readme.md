All routes deatail
token for harsh :- eyJhbGciOiJIUzI1NiJ9.aGFyc2hAZ21haWwuY29t.nB9qGNA0JVHxhTPVhoUEOdZ7VX6S7edp-zEt0eCYTt4

token for darshan :- eyJhbGciOiJIUzI1NiJ9.ZGFyc2hhbkBnbWFpbC5jb20.RSOo3J4HomMZLbkp5ZAsL9hpJgUawIRW1U3-aoyR044

1. route:- "/login"
**    Method : POST**

**Required Data:** `{email, password}`

**Example:**
```json
{ "email":"darshan@gmail.com", "password":"asdasdadasd"}
```

**Returns:** `{token: "bearer gibberish(Token value) "}`

**Note:** required after login so set this token as header


2. route:- "/signup"
**    Method : POST**

**Required Data:** `{username, email, password}`

**Example:**
```json
{ "username":"Darshan", "email":"darshan@gmail.com", "password":"asdasdadasd"}
```

    return:- {message} of error or successfull
**Note:** all fields are required else get error message


3. route:- "/forgot_password"
    Methos: POST
**Required Data:** `token required`

**Returns:** `all customers name, mobile_number, organization, email`

    where to use :- in bill section to load customers data automatically 

4. route:- "/add_customer"
**    Method: POST**

**Required Data:** `token required, {name, phone_number, organization, email}`

    where to use :- use to add customer  

5. route:- "/get_organizations"
    Methos: GET
**Required Data:** `token required`

    where to use :- to load all the organizations in drawer

6. route:-"/get_standard_price"
**    Method:- GET**

**Required Data:** `token required`

    return :- { "standardPriceCow": int, standardPriceBuffalo: int}

7. route:-"/make_purchase"
**    Method:- POST**

**Required Data:** `token required, {organization, litre, fat, fat_price, amount, due_date, when, which}`

    NOTE:- when have only two values {morning/evening} and which have { cow/buffalo }
    Example:- {
        "organization":"tcs",
        "litre": 12 (number),
        "fat": 12.4 (number),
        "fat_price": 23 (number),
        "amount": 3200 (number),
        "due_date":"2024-09-25",
        "when":"morning",
        "which":"buffalo",
    }

8. route:- "/fetch_single_bill"
**    Method: GET**

**Required Data:** `token required, {organization, when, purchase_date}   `

    where to use :- to load single bill for update

9. route:- "/update_purchase" 
**    Method: PUT**

**Required Data:** `token required,{purchaseId,litre, fat, fat_price, amount, due_date, when, which}`



10. route:- "/get_bills"
**    Method:- GET**

**Required Data:** `token required`

    where to use: to load all the bills 

11. route:- "/deletepuchaseorder"
**    Method: DELETE**

**Required Data:** `{purchaseId`

    return : delete message 

12. route:-"/paymentdone"
**    Method: PUT**

**Required Data:** `token requried, {purchaseId `


13. route:-"/getusers_for_calendar"
**    Method: GET**

**Required Data:** `token requried`

    where to use :- to get data to render in calender section

14. route:-"/getcalendar_count_status"
**    Method:- GET**

**Required Data:** `token requried`

    where to use :- to show the payments status on bill section('paid','overdue','pending)

15. route:-"/get_profile_data"
**    Method:- GET**

    required data :- token required
    return :- user data 
    where to use :- to fetch profile data

16. route:-"/update_profile"
**    Method:- PUT**

    requried data : token requried, username, location, standardPriceCow, standardPriceBuffalo
    where to use :- to udate user profile
**    Method:- GET**

**Required Data:** `token required`

    return :- image of user

17. route:-"/getreport"
**    Method:- GET**

**Required Data:** `token required, {purchaseId:int}`

    return :- report.pdf

18. route:-"/get_full_report"
**    Method:- GET**

**Required Data:** `token required, {organization:string}`

    return:- { userdata:{...}, purchases:{...}}

19. route:-"/get_bills_on_organizations"
**    Method:- GET**

**Required Data:** `token required, {organization}`

    where to use :- get bills based on organization

20. route:-"/mark_as_all_paid"
**    Method:- PUT**

**Required Data:** `token required, {organization} `

    where to use :- use to update all bills under one organization

21. route:-"/update_advanced_payment_amount"
**    Method:- PUT**

**Required Data:** `token required, {organization, amount}`

    where to use :- use to update the advanced payment amount to perticuler organization

22. route:-"/fetch_todays_bills"
**    Method:- GET**

**Required Data:** `token required`

    where to use:- use to fetch todays bills 
# ssd ho gaya 