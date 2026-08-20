/*
 * Muwajeh - About Page
 * Dynamic statistics from the database
 */

const API_URL = "http://localhost:3000/api";


// =========================================================
// LOAD FACULTIES + MAJORS COUNT
// =========================================================

async function loadAboutStats() {

    const facultiesCount =
        document.getElementById("faculties-count");

    const majorsCount =
        document.getElementById("majors-count");


    if (!facultiesCount || !majorsCount) {
        console.error(
            "About statistics elements were not found."
        );

        return;
    }


    try {

        // Load faculties
        const facultiesResponse =
            await fetch(`${API_URL}/faculties`);

        if (!facultiesResponse.ok) {
            throw new Error(
                `Faculties request failed: ${facultiesResponse.status}`
            );
        }


        // Load majors
        const majorsResponse =
            await fetch(`${API_URL}/majors`);

        if (!majorsResponse.ok) {
            throw new Error(
                `Majors request failed: ${majorsResponse.status}`
            );
        }


        const facultiesResult =
            await facultiesResponse.json();

        const majorsResult =
            await majorsResponse.json();


        console.log(
            "Faculties API:",
            facultiesResult
        );

        console.log(
            "Majors API:",
            majorsResult
        );


        // -------------------------------------------------
        // Get arrays from API response
        // -------------------------------------------------

        const faculties =
            Array.isArray(facultiesResult)
                ? facultiesResult
                : facultiesResult.data ||
                  facultiesResult.faculties ||
                  [];


        const majors =
            Array.isArray(majorsResult)
                ? majorsResult
                : majorsResult.data ||
                  majorsResult.majors ||
                  [];


        // -------------------------------------------------
        // Display counts
        // -------------------------------------------------

        facultiesCount.textContent =
            `+${faculties.length}`;


        majorsCount.textContent =
            `+${majors.length}`;


    } catch (error) {

        console.error(
            "Error loading About statistics:",
            error
        );


        facultiesCount.textContent = "—";
        majorsCount.textContent = "—";
    }
}


// =========================================================
// START
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    loadAboutStats
);