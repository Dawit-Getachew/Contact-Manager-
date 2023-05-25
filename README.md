# Contact-Manager-Assignment
API's
User Auth API's
1. register ({url}/api/users/register/) post method returns email and id of created user
    requires username, email, password in json body object 
2. login ({url}/api/users/login/) post method, returns access token in string
    requires email, password in json body object
3. currentUser ({url}/api/users/current/) get method, returns username, email and user id
    needs authenthication access token in header like > Authenthication "bearer token_recieved_when_login" 



Contact Manager API's
    needs authenthication access token in header like > Authenthication "bearer token_recieved_when_login" 
1. create contact ({url}/api/contacts/) post method, returns created contact
    accepts name, email, phone field in json body object
2. get all contacts ({url}/api/contacts/) get method, returns all contact array for that user
3. get single contact ({url}/api/contacts/:id) get method, returns single contact information
    requires id in url like {url}/api/contacts/some_id
4. update contact ({url}/api/contacts/:id) put method, returns updated contact information
    requires and accepts name, email, phone fields in json body object
5. delete contact ({url}/api/contacts/:id) delete method, returns deleted response message
    requires id in url like {url}/api/contacts/some_id



Library and framework used
1. express.js for backend api
2. mongoDb for database
3. jsonwebtoken for auth signiture
4. express-async-handler for handling exception errors
5. Jest for testing
6. mongoose for database connection with mongoDb

Test written for
1. createContact.test.js for create contact, 7 test cases
2. getSingleContact.test.js for get single contact, 3 test cases
3. updateContact.test.js for update contact, 7 test cases
4. deleteContact.test.js for delete contact, 4 test cases
5. getContact.test.js for get contact, 4 test cases
6. validateToken.test.js for validate token, 4 test cases
7. auth.register.test.js for register, 8 test cases 
8. auth.login.test.js for login, 6 test cases
9. auth.currentUser.test.js for current user, 5 test cases
10. email-phone-validator.test.js for validating email and phone number, 4 tests

Tital Test Suites = 10
Total TestCases = 52

