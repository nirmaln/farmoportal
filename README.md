# farmoportal
farmoportal


npm install

Server API Endpoint : http://localhost:8454/fp/api/v1

1. Sign up user

POST: http://localhost:8454/fp/api/v1/register

{   "name": "test1",
    "email": "test1@test.com",
    "phone": "789456212",
    "country" : "India",
    "birthDate" : "12/2/1956",
    "gender" : "Male",
    "password": "123456",
    "emailId" : "cvsdf@gmil.com"
}

error: {"error":"Cannot save the user"}
Success : {"name":"test2","rolename":"All"}

2. Login user

a@a.com
1
