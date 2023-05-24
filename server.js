const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/error-handler')
const connectDb = require('./config/db-connection')
dotenv.config();
const app = express()
const PORT = process.env.PORT || 5000

//complete the following test cases 
/**
 1. createContact.test.js
 2. getSingleContact.test.js
 3. updateContact.test.js
 4. validateToken.test.js
 */

connectDb()


app.use(express.json());
app.use('/api/contacts', require('./routes/contact-routes'));
app.use('/api/users', require('./routes/user-routes'))
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`)
});
