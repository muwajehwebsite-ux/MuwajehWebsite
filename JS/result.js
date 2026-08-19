const RESULT_KEY = "muwajeh_local_results";

const majorsGrid = document.getElementById("majorsGrid");
const downloadPdfButton = document.getElementById("downloadPdfButton");
const retakeButton = document.getElementById("retakeButton");

const API_URL = "/api";


// ======================================================
// TOAST
// ======================================================

function showToast(message, type = "error") {
    let toast = document.getElementById("muwajehToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "muwajehToast";
        toast.className = "muwajeh-toast";

        document.body.appendChild(toast);
    }

    const icon =
        type === "success"
            ? "fa-circle-check"
            : "fa-circle-exclamation";

    toast.className = `muwajeh-toast ${type}`;

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    clearTimeout(toast._timer);

    toast._timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}


// ======================================================
// CONFIRM MODAL
// ======================================================

function showConfirmModal(message) {
    return new Promise((resolve) => {

        const existing =
            document.getElementById("muwajehConfirm");

        if (existing) {
            existing.remove();
        }

        const modal = document.createElement("div");

        modal.id = "muwajehConfirm";
        modal.className = "muwajeh-confirm-overlay";

        modal.innerHTML = `
            <div class="muwajeh-confirm-box" dir="rtl">

                <div class="muwajeh-confirm-icon">
                    <i class="fa-solid fa-rotate-right"></i>
                </div>

                <h3>إعادة الاختبار</h3>

                <p>${message}</p>

                <div class="muwajeh-confirm-actions">

                    <button
                        type="button"
                        class="muwajeh-confirm-cancel"
                    >
                        إلغاء
                    </button>

                    <button
                        type="button"
                        class="muwajeh-confirm-ok"
                    >
                        إعادة الاختبار
                    </button>

                </div>

            </div>
        `;

        document.body.appendChild(modal);

        const cancelButton =
            modal.querySelector(".muwajeh-confirm-cancel");

        const confirmButton =
            modal.querySelector(".muwajeh-confirm-ok");


        function close(value) {

            modal.classList.remove("show");

            setTimeout(() => {
                modal.remove();
            }, 200);

            resolve(value);
        }


        cancelButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            close(false);
        });


        confirmButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            close(true);
        });


        modal.addEventListener("click", (event) => {

            if (event.target === modal) {
                close(false);
            }

        });


        requestAnimationFrame(() => {
            modal.classList.add("show");
        });

    });
}


// ======================================================
// LOAD RESULTS
// ======================================================

async function loadResults() {

    const token =
        localStorage.getItem("muwajeh_token") ||
        sessionStorage.getItem("muwajeh_token");


    if (!token) {
        window.location.replace("login.html");
        return null;
    }


    try {

        const response =
            await fetch(`${API_URL}/assessments/current`, {

                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });


        if (response.status === 401) {

            localStorage.removeItem("muwajeh_token");
            localStorage.removeItem("muwajeh_user");

            sessionStorage.removeItem("muwajeh_token");

            window.location.replace("login.html");

            return null;
        }


        if (!response.ok) {
            throw new Error(
                `Results request failed: ${response.status}`
            );
        }


        const result = await response.json();


        if (!result.success) {
            throw new Error(
                result.message || "Failed to load results"
            );
        }


        if (result.status !== "completed") {

            window.location.replace("test.html");

            return null;
        }


        const data = {

            attemptId:
                result.data.attempt.id,

            results:
                result.data.results

        };


        sessionStorage.setItem(
            RESULT_KEY,
            JSON.stringify(data)
        );


        return data;

    } catch (error) {

        console.error(
            "Error loading results:",
            error
        );

        showError(
            "تعذر تحميل نتيجة الاختبار."
        );

        return null;
    }
}


// ======================================================
// RENDER RESULTS
// ======================================================

function renderResults(results) {

    if (
        !Array.isArray(results) ||
        results.length === 0
    ) {

        showError(
            "لم يتم العثور على تخصصات مناسبة."
        );

        return;
    }


    majorsGrid.innerHTML = "";


    results
        .slice(0, 6)
        .forEach(function (result, index) {

            const score =
                Number(result.compatibilityScore);


            const card =
                document.createElement("article");

            card.className =
                index === 0
                    ? "major-card top-card"
                    : "major-card";


            const rank =
                document.createElement("span");

            rank.className =
                "rank-number";

            rank.textContent =
                index + 1;


            const content =
                document.createElement("div");

            content.className =
                "major-content";


            const scoreRing =
                document.createElement("div");

            scoreRing.className =
                `score-ring score-${Math.round(score)}`;


            scoreRing.innerHTML = `
                <span>
                    ${Math.round(score)}%
                </span>
            `;


            const info =
                document.createElement("div");

            info.className =
                "major-info";


            const title =
                document.createElement("h2");

            title.textContent =
                result.nameAr ||
                "تخصص غير معروف";


            if (index === 0) {

                const label =
                    document.createElement("span");

                label.className =
                    "score-label highlight";


                label.innerHTML = `
                    <i class="fa-solid fa-star"></i>
                    توافق ممتاز
                `;


                info.appendChild(title);
                info.appendChild(label);

            } else {

                const track =
                    document.createElement("div");

                track.className =
                    "score-track";


                const fill =
                    document.createElement("div");

                fill.style.width =
                    `${score}%`;


                track.appendChild(fill);


                const scoreText =
                    document.createElement("span");

                scoreText.className =
                    "score-text";


                scoreText.textContent =
                    `${Math.round(score)}% - ${getScoreLabel(score)}`;


                info.appendChild(title);
                info.appendChild(track);
                info.appendChild(scoreText);
            }


            content.appendChild(scoreRing);
            content.appendChild(info);


            card.appendChild(rank);
            card.appendChild(content);


            majorsGrid.appendChild(card);

        });
}


// ======================================================
// SCORE LABEL
// ======================================================

function getScoreLabel(score) {

    if (score >= 90) {
        return "توافق ممتاز";
    }

    if (score >= 80) {
        return "توافق جيد جداً";
    }

    if (score >= 70) {
        return "توافق جيد";
    }

    return "توافق متوسط";
}


// ======================================================
// ERROR
// ======================================================

function showError(message) {

    majorsGrid.innerHTML = `
        <article class="major-card">

            <div class="major-content">

                <div class="major-info">

                    <h2>
                        ${message}
                    </h2>

                </div>

            </div>

        </article>
    `;
}


// ======================================================
// RETAKE EXAM
// ======================================================

if (retakeButton) {

    retakeButton.type = "button";


    retakeButton.addEventListener(
        "click",
        async function (event) {

            // VERY IMPORTANT:
            // Prevent form submission / page refresh.
            event.preventDefault();
            event.stopPropagation();


            const token =
                localStorage.getItem("muwajeh_token") ||
                sessionStorage.getItem("muwajeh_token");


            if (!token) {

                window.location.href =
                    "login.html";

                return;
            }


            const confirmed =
                await showConfirmModal(
                    "سيتم حذف نتيجتك الحالية والبدء باختبار جديد. هل تريد المتابعة؟"
                );


            if (!confirmed) {
                return;
            }


            retakeButton.disabled = true;

            retakeButton.textContent =
                "جاري تجهيز الاختبار...";


            try {

                const response =
                    await fetch(
                        `${API_URL}/assessments/current`,
                        {
                            method: "DELETE",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                const result =
                    await response.json();


                if (response.status === 401) {

                    localStorage.removeItem(
                        "muwajeh_token"
                    );

                    localStorage.removeItem(
                        "muwajeh_user"
                    );

                    sessionStorage.removeItem(
                        "muwajeh_token"
                    );

                    window.location.href =
                        "login.html";

                    return;
                }


                if (
                    !response.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        "Failed to delete previous exam"
                    );
                }


                // Clear old exam data.

                localStorage.removeItem(
                    "muwajeh_exam_answers"
                );

                localStorage.removeItem(
                    "muwajeh_attempt_id"
                );

                sessionStorage.removeItem(
                    "muwajeh_local_results"
                );


                // Start completely fresh exam.

                window.location.href =
                    "test.html";


            } catch (error) {

                console.error(
                    "Error resetting exam:",
                    error
                );


                showToast(
                    "تعذر إعادة الاختبار. حاول مرة أخرى.",
                    "error"
                );


                retakeButton.disabled =
                    false;


                retakeButton.textContent =
                    "إعادة الاختبار";
            }

        }
    );

}


// ======================================================
// DOWNLOAD PDF
// ======================================================

async function downloadResultsPDF() {

    const token =
        localStorage.getItem("muwajeh_token") ||
        sessionStorage.getItem("muwajeh_token");


    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    if (!downloadPdfButton) {
        return;
    }


    downloadPdfButton.disabled =
        true;


    const originalHTML =
        downloadPdfButton.innerHTML;


    downloadPdfButton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>
            جاري إنشاء ملف PDF...
        </span>
    `;


    try {

        const response =
            await fetch(
                `${API_URL}/assessments/results/pdf`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        if (response.status === 401) {

            localStorage.removeItem(
                "muwajeh_token"
            );

            localStorage.removeItem(
                "muwajeh_user"
            );

            sessionStorage.removeItem(
                "muwajeh_token"
            );

            window.location.href =
                "login.html";

            return;
        }


        if (!response.ok) {

            let message =
                "تعذر إنشاء ملف PDF.";


            try {

                const error =
                    await response.json();


                if (error.message) {
                    message =
                        error.message;
                }

            } catch (_) {
                // Server returned non-JSON error.
            }


            throw new Error(message);
        }


        const blob =
            await response.blob();


        if (!blob || blob.size === 0) {

            throw new Error(
                "ملف PDF فارغ."
            );
        }


        const url =
            window.URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href =
            url;


        link.download =
            "نتيجة-اختبار-موّجه.pdf";


        document.body.appendChild(link);


        link.click();


        link.remove();


        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 1000);


        showToast(
            "تم تحميل ملف PDF بنجاح",
            "success"
        );


    } catch (error) {

        console.error(
            "PDF download error:",
            error
        );


        showToast(
            error.message ||
            "حدث خطأ أثناء تحميل ملف PDF.",
            "error"
        );


    } finally {

        downloadPdfButton.disabled =
            false;

        downloadPdfButton.innerHTML =
            originalHTML;
    }
}


if (downloadPdfButton) {

    downloadPdfButton.type =
        "button";


    downloadPdfButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            downloadResultsPDF();
        }
    );
}


// ======================================================
// INITIALIZE
// ======================================================

async function initializeResults() {

    const data =
        await loadResults();


    if (!data) {
        return;
    }


    renderResults(
        data.results
    );
}


initializeResults();