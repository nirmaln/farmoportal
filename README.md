# farmoportal
farmoportal


npm install

Server API Endpoint : http://localhost:8454/fp/api/v1

1. Sign up user

POST: http://localhost:8454/fp/api/v1/register

{   "loginName":  "test1@test.com",
    "name": "test1",
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

POST: http://localhost:8454/fp/api/login

{   "loginName": "test1@test.com",
	"password": "123456"
}

success : HTTP status success 
{ 
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QxQHRlc3QuY29tIiwidG9rZW4iOiJ0ZXN0MUB0ZXN0LmNvbXNlY3VyZXRva2VuIiwicGVybWlzc2lvbnMiOlsiUGVybWlzc2lvbjEiLCJQZXJtaXNzaW9uMiJdLCJyb2xlTmFtZSI6IkFsbCIsImlhdCI6MTQ5MjM2NTYwOSwiZXhwIjoxNDkyMzgzNjA5fQ.0OP58NSPFFgCg6fFORpMUQ4F321gGZJGIf7p0z0FcCg"
}
Error : Check HTTP Code 401
User name does not exist

3. Logout User 
 POST: http://localhost:8454/fp/api/logout
 success : HTTP status success  {"message":"logged out successfully"}
