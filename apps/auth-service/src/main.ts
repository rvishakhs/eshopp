import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import { posix } from 'path';
import { errorMiddleware } from '../../../packages/error-handler/error-middleware';
import router from './routes/auth.router';
import swaggerDocument = require('./swagger-output.json');


const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs-json", (req, res) => {
  res.json(swaggerDocument);
});
// Routes
app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.PORT || 6000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
  console.log(`Swagger docs at http://localhost:${port}/api-docs`);
});

server.on('error', (error) => {
  console.error("server error:", error);

});