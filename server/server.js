const express = require('express');
const dotenv = require('dotenv').config({ path: './config/.env' });
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const path = require('path');



// database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database connected'))
    .catch((err) => console.log('Database not connected', err))
    
   
// middleware
app.use(express.json())
app.use(cookieParser());
app.use(
    cors({
        credentials:true,
        origin:'http://localhost:5173'
    })

)



// routes
app.use('/', require('./routes/authroutes')),
app.use('/users', require('./routes/userroutes'));





const port = 3001;
app.listen(port, () => console.log(`Server is running on port ${port}`))
