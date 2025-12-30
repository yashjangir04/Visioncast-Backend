const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const db = require('./config/db-connect');
const userRouter = require('./routes/user-router');
const fileRouter = require('./routes/file-router');
const apiRouter = require('./routes/api-router');
const { validateAuth } = require('./controllers/authController');
const { validateToken } = require('./middlewares/authMiddleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: 'https://visioncast-theta.vercel.app',
        credentials: true
    }
))

const port = process.env.PORT || 3000;

app.use("/user", userRouter);
app.use("/file" , validateToken , fileRouter);
app.use("/api" , validateToken , apiRouter);
app.get("/validate", validateToken, validateAuth);

app.listen(port, () => {
  console.log(`Server is running on port ${port} ✅`);
});