const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const blogRoutes = require('./routes/blogs');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.static('public'));

const mongoURL = "mongodb+srv://yemyatmin:test1234@mern-blog.oc0lfoh.mongodb.net/?retryWrites=true&w=majority&appName=Mern-Blog"

mongoose.connect(mongoURL).then(() => {
    console.log("Connected to db");
    app.listen(process.env.PORT, () => {
        console.log("app is running on localhost: "+process.env.PORT)
    })
})

app.use(cors(
    {
        origin : "http://localhost:5173",
        credentials : true
    }
));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/', (req, res) => {
    return res.json({ hello : "world"})
})

app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

app.get('/set-cookie', (req, res) => {
    res.cookie('name','yemyat');
    res.cookie('important', 'value', { httpOnly : true })
    return res.send('cookie already set');
})

app.get('/get-cookie', (req, res) => {
    let cookies = req.cookies;
    return res.json(cookies);
})

