// const express = require('express')
// const app = express()
// app.all('/', (req, res) => {
//     console.log("Just got a request!")
//     res.send('Yo!')
// });
// app.listen(process.env.PORT || 3000)

if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');

const session = require('express-session');

const path = require('path');

const flash = require('connect-flash');

const formRoute = require('./routes/addMovie');
const postFormRoute = require('./routes/postAddMovie');
const editFormRoute = require('./routes/editMovie');
const getProducts = require('./routes/products');
const postEditRoute = require('./routes/postEdit');
// const getLangRoute = require('./routes/getLanguage');
const loginRoute = require('./routes/login');
const postLoginRoute = require('./routes/postLogin');
const postLogoutRoute = require('./routes/logout');

const cors = require('cors'); // Import the cors middleware

const PORT = process.env.PORT || 3000;

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Use cors middleware
app.use(cors(corsOptions));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
    session(
        { 
            secret: 'my secret', 
            resave: false, 
            saveUninitialized: false
        }
    )
);

app.use(flash());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', formRoute);

app.use('/v1', postFormRoute);

app.use('/v1', getProducts);

app.use('/v1', editFormRoute);

app.use('/v1', postEditRoute);

// app.use('/v1', getLangRoute);

app.use('/', loginRoute);

app.use('/v1', postLoginRoute);

app.use('/v1', postLogoutRoute);

app.listen(PORT, () => {
    console.log("Listening to localhost PORT 4000...");
})