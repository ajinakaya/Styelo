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


app.use(express.json());
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
app.use('/furniture', require('./routes/furnitureroutes'));
app.use('/category', require('./routes/categoryroutes'));
app.use('/section', require('./routes/sectionroutes'));
app.use('/returnpolicy', require('./routes/returnpolicyroutes'));
app.use('/cart', require('./routes/cartroutes'));
app.use('/wishlist', require('./routes/wishlistroutes'));
app.use('/shippingrate', require('./routes/shippingroutes'));
app.use('/order', require('./routes/orderroutes'));
app.use('/notifications', require('./routes/notificationrouter'));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const port = 3001;
app.listen(port, () => console.log(`Server is running on port ${port}`))
