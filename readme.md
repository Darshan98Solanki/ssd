## All routes deatail


1. route:- "/login"
    **Method : POST**

    **Required Data:** `{email, password}`
    
    **Example:**
    ```json
    { "email":"darshan@gmail.com", "password":"asdasdadasd"}
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
    { "username":"Darshan", "email":"darshan@gmail.com", "password":"asdasdadasd"}
    ```
        Returns:- {message} of error or successfull
    **Note:-** all fields are required else get error message
    <br/>



3. route:- "/forgot_password"
    **Methos: POST**
    
    **Required Data:** `{email, password}`

    **Example:**
    ```json
    { "username":"Darshan", "email":"darshan@gmail.com", "password":"asdasdadasd"}
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
    { "name":"Darshan", "phone_number":"1234567890", "organization":"abc", "email":"darshan@gmail.com"}
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
    Returns:- { "standardPriceCow": data, standardPriceBuffalo: data}
    ```
    **Note:-** to get the standard price
    <br/>



7. route:-"/make_purchase"
    **Method:- POST**
    
    **Required Data:** `token required, {organization, litre, fat, fat_price, amount, due_date, when, which}`
    
    **Example:**
    ```json
        {
            "organization":"abc",
            "litre": 12 (number),
            "fat": 12.4 (number),
            "fat_price": 23 (number),
            "amount": 3200 (number),
            "due_date":"2024-09-25",
            "when":"morning",
            "which":"buffalo",
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
                            "when_": "morning/evening",
                            "milk_type": "cow/buffalo",
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
            "litre": 12 (number),
            "fat": 12.4 (number),
            "fat_price": 23 (number),
            "amount": 3200 (number),
            "due_date":"2024-09-25",
            "when":"morning",
            "which":"buffalo",
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
                        "amount": 3200,
                        "due_date": "2024-09-25T00:00:00.000Z",
                        "payment_status": "pending"
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
                            "name": "Pranav",
                            "due_date": "2024-09-25T00:00:00.000Z",
                            "payment_status": "pending"
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
                        "paid": 0,
                        "overdue": 0,
                        "pending": 6
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
                            "name": "Harsh",
                            "email": "harsh@gmail.com",
                            "standard_price_cow": 15,
                            "standard_price_buffalo": 18,
                            "location": "anjar"
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
                        "advanced_payment": int
                    },
                    "purchases": [
                        {
                            "fat": int,
                            "purchase_date": "15-08-2024",
                            "amount": int,
                            "litre": int,
                            "milk_type": "text",
                            "when_": "text",
                            "purchase_time": "01:13:06 PM"
                        },
                        .
                        .
                    },
                    "total amount": int,
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
                            "due_date": "2024-09-25T00:00:00.000Z",
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




20. route:-"/update_advanced_payment_amount"
    **Method:- PUT**
    
    **Required Data:** `token required, {organization, amount}`
    
    **Example:**
    ```json
    { 
        "organization":"text", 
        "amount":int
    }
    ```
    ```
    Returns:- {message} for update profile or error
    ```

    **Note:-** use to update the advanced payment amount to perticuler organization
    <br/>



21. route:-"/fetch_todays_bills"
    **Method:- GET**
    
    **Required Data:** `token required`
    
        Returns:-{
                    "data": [
                        {
                            "organization": "anomaly",
                            "when_": "Morning",
                            "milk_type": "Cow",
                            "litre": 34,
                            "fat": 12,
                            "amount": 36720,
                            "purchase_time": "05:22:27 AM"
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