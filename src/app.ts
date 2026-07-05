import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import router from './routes/index.js';
import { initDb } from './db/index.js';

import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Load Swagger document
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src', 'swagger.json'), 'utf8')
);

// Set up CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded profile images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Register API routes
app.use('/', router);

// Serve Swagger UI on root
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  return res.status(500).json({
    status: 500,
    message: 'Internal server error',
    data: null,
  });
});

// Initialize DB and start server
async function startServer() {
  try {
    // Await database initialization
    await initDb();

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port} 🚀`);
    });
  } catch (error) {
    console.error('Failed to start server due to database initialization failure:', error);
    process.exit(1);
  }
}

startServer();
