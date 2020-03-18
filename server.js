const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//Route files
const bootcamps = require('./routes/bootcamp');

const app = express();

//Body parser
app.use(express.json());

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server runing in ${process.env.NODE_ENV}  mode on port ${PORT}`));

//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Erro: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
});
