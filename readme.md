## Technologies used
- Node.js
- Express.js
    - Routes Management
    - Zod validation
    - JWT authenitcation
- MySQL

## All routes deatail


1. route:- "/login"
    **Method : POST**

    **Required Data:** `{email, password}`
    
    **Example:**
    ```json
    { "email":"text", "password":"text"}
    ```
    ```
    Returns:- {token: "bearer gibberish(Token value) "}
    ```
    **Note:-** required after login so set this token as header
    <br/>



2. route:- "/signup"
    **Method : POST**
    
    **Required Data:** `{username, email, password}`
    
    **Example:**
    ```json
    { "username":"text", "email":"text", "password":"text"}
    ```
        Returns:- {message} of error or successfull
    **Note:-** all fields are required else get error message
    <br/>



3. route:- "/forgot_password"
    **Methos: POST**
    
    **Required Data:** `{email, password}`

    **Example:**
    ```json
    { "username":"text", "email":"text", "password":"text"}
    ```
    
    ```
    Returns:- {message} for update password or error
    ```
    
    **Note:-** in bill section to load customers data automatically 

    <br/>



4. route:- "/add_customer"
    **Method: POST**
    
    **Required Data:** `token required, {name, phone_number, organization, email}`
    
    ```json
    { "name":"text", "phone_number":"text", "organization":"text", "email":"text"}
    ```
    
    ```
    Returns:- {message} for customer added or error
    ```

    **Note :-** use to add customer  
    
    <br/>



5. route:- "/get_organizations"
    **Methos: GET**

    **Required Data:** `token required`
     ```
    Returns:-{
                    "data": [
                        {
                            "name": "text",
                            "organization": "text"
                        },
                        .
                        .
                    ]
                }
    ```

    **Note :-** to load all the organizations in drawer
    <br/>
    
    
    

6. route:-"/get_standard_price"
    **Method:- GET**
    
    **Required Data:** `token required`
    
    ```
    Returns:- { "standardPriceCow": int, standardPriceBuffalo: int}
    ```
    **Note:-** to get the standard price
    <br/>



7. route:-"/make_purchase"
    **Method:- POST**
    
    **Required Data:** `token required, {organization, litre, fat, fat_price, amount, due_date, when, which}`
    
    **Example:**
    ```json
        {
            "organization":"text",
            "litre": int,
            "fat": int,
            "fat_price": int,
            "amount": int,
            "advance_amount": int,
            "due_date":"yyyy-mm-dd",
            "when":"text",
            "which":"text",
        }
    ```
        Returns:- {message} for order place or error

    **Note:-** use to add purchase order, when have only two values **{morning/evening}** and which have **{cow/buffalo}**

    <br/>
    
    
    
8. route:- "/fetch_single_bill"
    **Method: GET**
    
    **Required Data:** `token required, {organization, when, purchase_date}   `
    
        Returns:- {
                    "data": [
                        {
                            "purchase_id": int,
                            "name": "text",
                            "organization": "text",
                            "fat_price": float,
                            "when_": "text",
                            "milk_type": "text",
                            "due_date": "yyyy-mm-dd",
                            "litre": int,
                            "fat": int,
                            "amount": int
                        }
                    ]
                }

    **Note:-** to load single bill for update bill 
    <br/>




9. route:- "/update_purchase" 
    **Method: PUT**
    
    **Required Data:** `token required,{purchaseId,litre, fat, fat_price, amount, due_date, when, which}`
    
     **Example:**
    ```json
        {
            "purchaseId":int,
            "litre": int,
            "fat": int,
            "fat_price": int,
            "amount": int,
            "advance_amount":int,
            "due_date":"yyyy-mm-dd",
            "when":"text",
            "which":"text",
        }
    ```
        Returns:- {message} for order update or error

    **Note:-** to update the purchase order
    <br/>
    
    

10. route:- "/get_bills"
    **Method:- GET**
    
    **Required Data:** `token required`
    ```
    Returns:-{
                "data": [
                    {
                        "purchase_id": int,
                        "customer_id": int,
                        "name": "text",
                        "amount": int,
                        "due_date": "yyyy-mm-ddT00:00:00.000Z",
                        "payment_status": "text"
                    },
                    .
                    .
                ]
            }
    ```

    **Note:-** to load all the bills 
    <br/>
    
    
    
11. route:- "/deletepuchaseorder"
    **Method: DELETE**
    
    **Required Data:** `token required, {purchaseId}`
    
        Returns:- {message} for delete or error
    
    **Note:-** use to delete the purchase order
    <br/>



12. route:-"/paymentdone"
    **Method: PUT**
    
    **Required Data:** `token requried, {purchaseId}`
        
        Returns:- {message} for payment done or error
    **Note:-** use to update the payment status to paid
    <br/>
    


13. route:-"/getusers_for_calendar"
    **Method: GET**
    
    **Required Data:** `token requried`
    
        Returns:-{
                    "message": [
                        {
                            "name": "text",
                            "due_date": "yyyy-mm-ddT00:00:00.000Z",
                            "payment_status": "text"
                        },
                        .
                        .
                    ]
                }


    **Note:-** to get data to render in calender section
    <br/>
    


14. route:-"/getcalendar_count_status"
    **Method:- GET**
        
    **Required Data:** `token requried`
                
        Returns:-{
                    "data": {
                        "paid": int,
                        "overdue": int,
                        "pending": int
                    }
                }        

    **Note** :- to show the payments status on bill section('paid','overdue','pending)
    
    <br/>
    

15. route:-"/get_profile_data"
    **Method:- GET**

    **Required Data:** `token requried`
    
        Returns:-{
                    "data": [
                        {
                            "name": "text",
                            "email": "text",
                            "standard_price_cow": int,
                            "standard_price_buffalo": int,
                            "location": "text"
                        }
                    ]
                }
        
    **Note:-** use to fetch profile data
    <br/>

16. route:-"/update_profile"
    **Method:- PUT**
    
    **Required Data:** `token requried, { username, location, standardPriceCow, standardPriceBuffalo }`
    
    **Example:**
    ```json
    { 
        "username":"text", 
        "location":"text",
        "StandardPriceCOw":int,
        "standardPriceBuffalo":int
    }
    ```
    ```
    Returns:- {message} for update profile or error
    ```

    **Note:-** to udate user profile
    <br/>
    
    

17. route:-"/get_full_report"
    **Method:- GET**

    **Required Data:** `token required, {organization}`

        return:-{
                    "userdata": {
                        "name": "text",
                        "mobile_no": "text",
                        "email": "text",
                        "organization": "text",
                    },
                    "purchases": [
                        {
                            "fat": int,
                            "purchase_date": "dd-mm-yyyy",
                            "amount": int,
                            "advance_amount":int,
                            "litre": int,
                            "milk_type": "text",
                            "when_": "text",
                            "purchase_time": "hh:mm:ss AM/PM"
                        },
                        .
                        .
                    ],
                    "total amount": int,
                    "total advance": int,
                    "grand total": int
                }   
                
    **Note:-** use to generate report in pdf formate
    <br/>
    
    
18. route:-"/get_bills_on_organizations"
    **Method:- GET**
    
    **Required Data:** `token required, {organization}`
        
        Returns:-{
                    "data": [
                        {
                            "purchase_id": int,
                            "customer_id": int,
                            "name": "text",
                            "amount": int,
                            "due_date": "yyyy-mm-ddT00:00:00.000Z",
                            "payment_status": "text"
                        },
                        .
                        .
                        .
                    ]
                }

    **Note:-** get bills based on organization search
    <br/>
    
    
19. route:-"/mark_as_all_paid"
    **Method:- PUT**
    
    **Required Data:** `token required, {organization} `
            
    **Example:**
    ```json
    { 
        "organization":"text"
    }
    ```
    ```
    Returns:- {message} for update profile or error
    ```
    
    **Note:-** use to update all bills under one organization
    <br/>


20. route:-"/fetch_todays_bills"
    **Method:- GET**
    
    **Required Data:** `token required`
    
        Returns:-{
                    "data": [
                        {
                            "email":"text",
                            "organization": "text",
                            "when_": "text",
                            "milk_type": "text",
                            "litre": int,
                            "fat": int,
                            "amount": int,
                            "purchase_time": "hh:mm:ss AM/PM"
                        },
                        .
                        .
                        .
                    ]
                }
                or
                {message} if no purchase done for today

    **Note:-** use to fetch todays bills 
    <br/>

21. route:-"/get_all_bills"
    **Method:- GET**

    **Required Data:** `token required`

    
    ```
        Returns:-{
                    
                    "purchases": [
                        {   
                            "email":"text",
                            "organization": "text"
                            "fat": int,
                            "purchase_date": "dd-mm-yyyy",
                            "advance_amount": int,
                            "due_date": "dd-mm-yyyy",
                            "amount": int,
                            "litre": int,
                            "milk_type": "text",
                            "when_": "text",
                            "purchase_time": "hh:mm:ss",
                            "payment_status": "text"
                        },
                        .
                        .
                        .
                    ],
                    "total amount": int,
                    "total advnace": int,
                    "total paid": int,
                    "total unpaid": int
                
                }
            or
            {message} if no purchase done for today
    ```
    **Note:-** get all bills to generate the report in profile section {paid, unpaid and pending payments} 
    <br/>

22. route:-"/get_all_bills_on_organizations"
    **Method:- GET**

    **Required Data:** `token required, {organization}`
    
    **Example**
    ```json
        {
            "organization":"text"
        }
    ```
    ```
        Returns:-{
                    "userdata": {
                        "name": "text",
                        "mobile_no": "text",
                        "email": "text",
                        "organization": "text"
                    },
                    "purchases": [
                        {
                            "fat": int,
                            "purchase_date": "dd-mm-yyyy",
                            "due_date": "dd-mm-yyyy",
                            "amount": int,
                            "advance_amount":int
                            "litre": int,
                            "milk_type": "text",
                            "when_": "text",
                            "purchase_time": "hh:mm:ss"
                            "payment_status":"status"
                        },
                        .
                        .
                        .
                    ],
                    "total amount paid": int,
                    "total amount unpaid": int,
                    "total advance": int
                }
            or
            {message} if no purchase done for today
    ```
    **Note:-** get all bills based on organization {paid, unpaid and pending payments} 
    <br/>