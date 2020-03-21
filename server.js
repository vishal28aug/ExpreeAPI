const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload')
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');


//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//Route files
const courses = require('./routes/course');
const bootcamps = require('./routes/bootcamp');


const app = express();

//Body parser
app.use(express.json());

//File Uploading
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Mount routers
app.use('/api/v1/course', courses);
app.use('/api/v1/bootcamps', bootcamps);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server runing in ${process.env.NODE_ENV}  mode on port ${PORT}`));

//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Erro: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
});
