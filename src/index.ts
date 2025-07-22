import dotenv from "dotenv";
import express from "express";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (_, res) => {
    res.send("Success");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
