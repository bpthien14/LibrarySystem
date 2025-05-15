import express from "express";
import cors from "cors";
import { config } from "./config/config";
import { connectToDatabase } from "./utils/database";
import authRoutes from "./routes/auth.route";
import bookRoutes from "./routes/book.route";
import memberRoutes from "./routes/member.route";
import circulationRoutes from "./routes/circulation.route";
import dashboardRoutes from "./routes/dashboard.route";

const app = express();
const PORT = config.server.port;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/circulation", circulationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("API quản lý thư viện đang hoạt động!");
});

async function startServer() {
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`Server đang chạy tại http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Không thể khởi động server:", error);
        process.exit(1);
    }
}

startServer();
