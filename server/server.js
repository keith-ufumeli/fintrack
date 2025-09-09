import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import testRoutes from "./routes/testRoutes.js";

// For ES modules __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load correct env file
dotenv.config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV || "development"}`)
});

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FinTrack API",
      version: "1.0.0",
      description: "A personal finance tracking API for managing transactions and loans",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["githubId", "username", "email", "name"],
          properties: {
            _id: {
              type: "string",
              description: "Unique identifier for the user",
            },
            githubId: {
              type: "string",
              description: "GitHub user ID",
            },
            username: {
              type: "string",
              description: "GitHub username",
            },
            email: {
              type: "string",
              description: "User email address",
            },
            name: {
              type: "string",
              description: "User's display name",
            },
            avatar: {
              type: "string",
              description: "User's avatar URL",
            },
            lastLogin: {
              type: "string",
              format: "date-time",
              description: "Last login timestamp",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
            isActive: {
              type: "boolean",
              description: "Whether the account is active",
            },
          },
        },
        Transaction: {
          type: "object",
          required: ["user", "type", "amount"],
          properties: {
            _id: {
              type: "string",
              description: "Unique identifier for the transaction",
            },
            user: {
              type: "string",
              description: "User ID who owns this transaction",
            },
            type: {
              type: "string",
              enum: ["income", "expense"],
              description: "Type of transaction",
            },
            amount: {
              type: "number",
              description: "Transaction amount",
            },
            description: {
              type: "string",
              description: "Transaction description",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Transaction date",
            },
          },
        },
        Loan: {
          type: "object",
          required: ["user", "person", "amount", "type"],
          properties: {
            _id: {
              type: "string",
              description: "Unique identifier for the loan",
            },
            user: {
              type: "string",
              description: "User ID who owns this loan",
            },
            person: {
              type: "string",
              description: "Name of the person involved in the loan",
            },
            amount: {
              type: "number",
              description: "Loan amount",
            },
            type: {
              type: "string",
              enum: ["lend", "borrow"],
              description: "Type of loan - lend (I gave money) or borrow (I received money)",
            },
            description: {
              type: "string",
              description: "Loan description",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Loan date",
            },
            status: {
              type: "string",
              enum: ["unpaid", "paid"],
              description: "Loan status",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            token: {
              type: "string",
              description: "JWT access token",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            error: {
              type: "string",
              description: "Error details",
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path to the API files
};

const specs = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "FinTrack API Documentation"
}));

// Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/loans", loanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
