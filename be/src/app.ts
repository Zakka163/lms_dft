import { sq, testConnection } from "./config/connection.js";
import express from 'express';
import router from "./routes.js";
import cors from "cors"
const app = express();
const PORT = 5000;
testConnection()
app.use(cors({
  origin: "*",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});