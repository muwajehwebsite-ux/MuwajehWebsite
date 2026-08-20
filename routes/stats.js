const express = require("express");
const router = express.Router();

const pool = require("../config/db");

// =========================================================
// GET WEBSITE STATISTICS
// =========================================================

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                (
                    SELECT COUNT(*)
                    FROM faculties
                    WHERE is_active = true
                ) AS faculties_count,

                (
                    SELECT COUNT(*)
                    FROM majors
                    WHERE is_active = true
                ) AS majors_count
        `);

        res.json({
            success: true,
            data: {
                faculties: Number(result.rows[0].faculties_count),
                majors: Number(result.rows[0].majors_count)
            }
        });

    } catch (error) {
        console.error("Error fetching website statistics:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load website statistics"
        });
    }
});

module.exports = router;