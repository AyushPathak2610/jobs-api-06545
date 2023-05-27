require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// security packages
const helmet = require('helmet');// set security headers
const cors = require('cors');// cross origin resource sharing
const xss = require('xss-clean');// clean user input from malicious html code
const rateLimiter = require('express-rate-limit');// limit the number of requests a user can make to our api

app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,// 15 minutes
  max: 100,// limit each IP to 100 requests per windowMs
}))
app.use(helmet());
app.use(cors());
app.use(xss());
app.set('trust proxy', 1);// trust first proxy  // this is needed for rate limiter to work properly
// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);//instead of having to write authenticateUser in every route we can write it here and it will be applied to all the routes in jobsRouter
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
