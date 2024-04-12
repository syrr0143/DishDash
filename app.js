import userRouter from './routes/user.routes.js'
import planRouter from './routes/plan.routes.js'
import restaurantRouter from './routes/restaurant.route.js'
import reviewRouter from './routes/review.routes.js'
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use('/api/v1/user', userRouter);
app.use('/api/v1/restaurant', restaurantRouter);
app.use('/api/v1/plan', planRouter);
app.use('/api/v1/review', reviewRouter);
export { app }