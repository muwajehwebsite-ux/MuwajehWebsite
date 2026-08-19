const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// ======================================================
// FRONTEND
// ======================================================

app.use(express.static(path.join(__dirname, "HTML")));

app.use("/CSS", express.static(path.join(__dirname, "CSS")));

app.use("/JS", express.static(path.join(__dirname, "JS")));

app.use("/images", express.static(__dirname));


// ======================================================
// API ROUTES
// ======================================================

const authRoutes = require("./routes/auth");
const universitiesRoutes = require("./routes/universities");
const facultiesRoutes = require("./routes/faculties");
const majorsRoutes = require("./routes/majors");
const questionsRoutes = require("./routes/questions");
const assessmentsRoutes = require("./routes/assessments");
const wishlistRoutes = require("./routes/wishlist");
const majorDetailsRoutes = require("./routes/major-details");

app.use("/api/auth", authRoutes);
app.use("/api/universities", universitiesRoutes);
app.use("/api/faculties", facultiesRoutes);
app.use("/api/majors", majorsRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/assessments", assessmentsRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/major-details", majorDetailsRoutes);


// ======================================================
// API TEST
// ======================================================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Muwajeh backend is working!"
    });
});


// ======================================================
// PING
// ======================================================

app.get("/ping", (req, res) => {
    res.status(200).send("pong");
});


// ======================================================
// HOMEPAGE
// ======================================================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "HTML", "index.html")
    );
});


// ======================================================
// 404
// ======================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found"
    });
});


// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
    console.error("Unhandled server error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});


// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});