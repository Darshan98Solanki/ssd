All routes deatail
extra{
    token for harsh :- eyJhbGciOiJIUzI1NiJ9.aGFyc2hAZ21haWwuY29t.nB9qGNA0JVHxhTPVhoUEOdZ7VX6S7edp-zEt0eCYTt4

    token for darshan :- eyJhbGciOiJIUzI1NiJ9.ZGFyc2hhbkBnbWFpbC5jb20.RSOo3J4HomMZLbkp5ZAsL9hpJgUawIRW1U3-aoyR044
}
1. route:- "/signup"
    Method : POST
    required data : {username, email, password}
    example:- { "username":"Darshan", "email":"darshan@gmail.com", "password":"asdasdadasd"}
    Note:- all fields are required else get error message

2. route:- "/login"
    Method : POST
    required data : {email, password}
    example:- { "email":"darshan@gmail.com", "password":"asdasdadasd"}
    returns :- {token: "bearer gibberish(Token value) "}
    Note:- required after login so set this token as header

3. route:- "/getcustomers"
    Methos: GET
    required data : token required
    returns :- all customers name, mobile_number, organization, email
    where to use :- in bill section to load customers data automatically 

4. route:- "/makepurchase"
    Methos: POST
    required data : token required, {customer_name,phone_number,organization,email,litre,fat,fat_price,discount,amount,due_date,remainder_type,additional_notes}
    example :- 
{
    "customer_name":"Harsh",
    "phone_number":"6353466496",
    "organization":"abc",
    "email":"harsh@gmail.com",
    "litre":10,
    "fat":10,
    "fat_price":10,
    "discount":0,
    "amount":10,
    "due_date":"2024-07-24",
    "remainder_type":"every day",
    "additional_notes":"bhai dudh roj chahiye" 
}
    where to use :- make purchase order

5. route:- "/getbills"
    Method: GET
    required data : token required   
    where to use :- to load all the bills in bill section

6. route:- "/forgot_password"
    Method: POST
    required data : {email, password} 

7. route:- "/getcustomerdata"
    Method: GET
    required data : {purchaseId: int}
    return : data with that purchase order to place in update order section
    where to use :- to load data when updating the customer order data

8.  route:- "/deletepuchaseorder"
    Method: DELETE
    required data : {purchaseId: int}
    return : delete message 

9.  route:- "/updatepurchase"
    METHOD: PUT
    required data : token required, {purchaseId,customerId,customer_name,phone_number,organization,email,litre,fat,fat_price,discount,amount,due_date,remainder_type,additional_notes}
    example:- 
{
    "purchaseId":6,
    "customerId":5,
    "customer_name":"Pranav",
    "phone_number":"6353466496",
    "organization":"pravan",
    "email":"dars@gmail.com",
    "litre":100,
    "fat":10,
    "fat_price":10,
    "discount":5,
    "amount":1000,
    "due_date":"2024-08-24",
    "remainder_type":"every day",
    "additional_notes":"bhai dudh roj chahiye vo bhi tajha" 
}
    where to use :- to update the customer order details

10. route:-"/paymentdone"
    Method: PUT
    required data : token requried, {purchaseId : int}

11. route:-"/getusers_for_calendar"
    Method: GET
    required data : token requried
    where to use :- to get data to render in calender section

12. route:-"/getcalendar_count_status"
    Method:- GET
    required data : token requried
    where to use :- to show the payments status on bill section('paid','overdue','pending)

13. route:-"/update_profile"
    Method:- PUT
    requried data : token requried, username, location, standardPrice
    where to use :- to udate user profile

14. route:-"/get_profile_data"
    Method:- GET
    required data :- token required
    return :- user data 
    where to use :- to fetch profile data

15. route:-"/getprofile_image"
    Method:- GET
    required data : token required
    return :- image of user

16. route:-"/getreport"
    Method:- GET
    required data : token required, {purchaseId:int}
    return :- report.pdf

17. route:-"/get_standard_price"
    Method:- GET
    required data : token required
    return :- { "standardPrice": int }

18. route:-"/get_full_report"
    Method:- GET
    required data : token required, {organization:string}
    retunr :- { userdata:{...}, purchases:{...}}# ssd
