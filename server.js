const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors')
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');


//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//Route files
const courses = require('./routes/course');
const bootcamps = require('./routes/bootcamp');
const auth = require('./routes/auth');
const users = require('./routes/user');
const reviews = require('./routes/review');


const app = express();

//Body parser
app.use(express.json());

//Cookie Parse
app.use(cookieParser());

//File Uploading
app.use(fileupload());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attack
app.use(xss());

//Rate limitng
const limiter = rateLimit({
    windowMs:10 * 60 * 1000, //10 mins
    max: 100
});
app.use(limiter);

//Prevent http param pollution
app.use(hpp());

//Enable CORS
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Mount routers
app.use('/api/v1/courses', courses);
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/auth',auth);
app.use('/api/v1/auth/users',users);
app.use('/api/v1/reviews',reviews);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server runing in ${process.env.NODE_ENV}  mode on port ${PORT}`));

//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Erro: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
});
