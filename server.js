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

// HTML files become the website root
app.use(express.static(path.join(__dirname, "HTML")));

// CSS
app.use("/CSS", express.static(path.join(__dirname, "CSS")));

// JavaScript
app.use("/JS", express.static(path.join(__dirname, "JS")));


// Root images
app.get("/Logo.png", (req, res) => {
    res.sendFile(path.join(__dirname, "Logo.png"));
});

app.get("/logo-gold.png", (req, res) => {
    res.sendFile(path.join(__dirname, "logo-gold.png"));
});

app.get("/LogoIcon.png", (req, res) => {
    res.sendFile(path.join(__dirname, "LogoIcon.png"));
});

app.get("/University.jpg", (req, res) => {
    res.sendFile(path.join(__dirname, "University.jpg"));
});


// Homepage
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "HTML", "index.html")
    );
});


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