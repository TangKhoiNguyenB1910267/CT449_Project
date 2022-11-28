const express = require("express");
const cors = require("cors");
const comicsRouter = require("./app/routes/comic.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/comics", comicsRouter);

// handle 404 response
app.use((req, res, next) => {
    // Code o day se chay khi khong co route duoc dinh nghia nao
    //  khop voi yeu cau. Goi next() de chuyen sang middleware xử lí loi
    return next(new ApiError(404, "Resoure not found"));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((error, req, res, next) => {
    // Middleware xu li loi tap trung
    // Trong cac doan code xu ly o cac route, goi next(error)
    //  se chuyen ve middleware xu ly loi nay
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to review comic application." });
});

module.exports = app;