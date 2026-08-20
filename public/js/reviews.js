/* ==========================================
            REVIEWS MODULE
========================================== */

// ===============================
// DOM ELEMENTS
// ===============================

const reviewForm = document.getElementById("reviewForm");
const reviewContainer = document.getElementById("reviewsContainer");
const reviewBtn = document.getElementById("reviewBtn");
const reviewCount = document.getElementById("reviewCount");
const averageRating = document.getElementById("averageRating");
const noReviewsMessage = document.getElementById("noReviewsMessage");
const editReviewForm = document.getElementById("editReviewForm");


// ===============================
// HELPERS
// ===============================

function getListingId() {

    if (!reviewForm) return null;

    return reviewForm.dataset.listingId;

}


// Review Count + Average Rating
function updateReviewStats(data) {

    if (reviewCount) {
        reviewCount.textContent = data.reviewCount;
    }

    if (averageRating) {

        averageRating.textContent =
            data.reviewCount > 0
                ? data.averageRating
                : "New";
    }

}


// Hide Empty State
function hideNoReviewMessage() {

    if (!noReviewsMessage) return;

    noReviewsMessage.classList.add("d-none");

}


// Show Empty State
function showNoReviewMessage() {

    if (!reviewContainer) return;

    if (reviewContainer.children.length === 0) {

        noReviewsMessage.classList.remove("d-none");

    }

}


// Reset Add Review Form
function resetReviewForm() {

    if (!reviewForm) return;

    reviewForm.reset();

    reviewForm.classList.remove("was-validated");

    if (reviewBtn) {

        reviewBtn.disabled = false;

    }

}


// Bootstrap Modal Helper
function getEditModal() {

    return bootstrap.Modal.getOrCreateInstance(

        document.getElementById("editReviewModal")

    );

}


// Fill Edit Modal
function fillEditModal(button) {

    document.getElementById("editReviewId").value =
        button.dataset.reviewId;

    document.getElementById("editComment").value =
        button.dataset.comment;

    document.getElementById("editRating").value =
        button.dataset.rating;

}

/* ==========================================
        REVIEW CARD HELPERS
========================================== */

// Render Rating Stars
function renderStars(rating) {

    return `
        <p
            class="starability-result"
            data-rating="${rating}">
        </p>
    `;

}


// Create Review Card
function reviewCard(review) {

    const listingId = getListingId();

    return `

<div
    class="col-md-6 mb-4 review-item"
    id="review-${review._id}">

    <div class="card shadow-sm border-0 review-card">

        <div class="card-body p-4">

            <div class="review-top">

                <div class="review-user">

                    <div class="review-avatar">

                        <i class="fa-solid fa-circle-user"></i>

                    </div>

                    <div>

                        <h6 class="mb-0">

                            ${review.author}

                        </h6>

                        <small class="verified-guest">

                            <i class="fa-solid fa-circle-check"></i>

                            Verified Guest

                        </small>

                    </div>

                </div>

                <div class="review-rating">

                    ${renderStars(review.rating)}

                </div>

            </div>

            <p class="review-comment">

                ${review.comment}

            </p>

            <div class="review-actions">

                <a
                    href="#"
                    class="btn edit-review-btn"
                    data-review-id="${review._id}"
                    data-comment="${review.comment}"
                    data-rating="${review.rating}">

                    <i class="fa-solid fa-pen"></i>

                    Edit Review

                </a>

                <form
                    method="POST"
                    action="/listings/${listingId}/reviews/${review._id}?_method=DELETE"
                    class="delete-review-form"
                    data-review-id="${review._id}">

                    <button
                        type="submit"
                        class="btn delete-review-btn">

                        <i class="fa-solid fa-trash"></i>

                        Delete Review

                    </button>

                </form>

            </div>

        </div>

    </div>

</div>

`;

}

/* ==========================================
        OPEN EDIT MODAL
========================================== */

document.addEventListener("click", function (e) {

    const editBtn = e.target.closest(".edit-review-btn");

    if (!editBtn) return;

    e.preventDefault();

    fillEditModal(editBtn);

    getEditModal().show();

});

/* ==========================================
        AJAX ADD REVIEW
========================================== */

if (reviewForm) {

    reviewForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        if (!reviewForm.checkValidity()) {

            reviewForm.classList.add("was-validated");
            return;

        }

        reviewBtn.disabled = true;

        reviewBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
            Posting...
        `;

        const formData = new URLSearchParams(
            new FormData(reviewForm)
        );

        try {

            const response = await fetch(reviewForm.action, {

                method: "POST",

                headers: {
                    Accept: "application/json"
                },

                body: formData

            });

            const data = await response.json();

            if (!data.success) {

                throw new Error("Unable to add review");

            }

            // Hide Empty Message
            hideNoReviewMessage();

            // Add Review Card
            reviewContainer.insertAdjacentHTML(
                "afterbegin",
                reviewCard(data.review)
            );

            // Update Stats
            updateReviewStats(data);

            // Reset Form
            resetReviewForm();

            Swal.fire({

                icon: "success",

                title: "Review Added!",

                timer: 1500,

                showConfirmButton: false

            });

        } catch (err) {

            console.error(err);

            Swal.fire({

                icon: "error",

                title: "Unable to add review"

            });

        } finally {

            reviewBtn.disabled = false;

            reviewBtn.innerHTML = `
                <i class="fa-solid fa-paper-plane"></i>
                <span class="btn-text">
                    Submit Review
                </span>
            `;

        }

    });

}

/* ==========================================
        AJAX EDIT REVIEW
========================================== */

if (editReviewForm) {

    editReviewForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const reviewId = document.getElementById("editReviewId").value;

        const comment = document.getElementById("editComment").value.trim();

        const rating = document.getElementById("editRating").value;

         const saveBtn = editReviewForm.querySelector('button[type="submit"]');

        try {

           

            saveBtn.disabled = true;

            saveBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
                Saving Changes...
        `;

            const response = await fetch(

                `/listings/${getListingId()}/reviews/${reviewId}?_method=PUT`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/x-www-form-urlencoded",

                        Accept: "application/json"

                    },

                    body: new URLSearchParams({

                        "review[rating]": rating,

                        "review[comment]": comment

                    })

                }

            );

            const data = await response.json();

            if (!data.success) {

                throw new Error("Unable to update review");

            }

            const card = document.getElementById(`review-${reviewId}`);

            if (!card) return;

            // Update Comment
            card.querySelector(".review-comment").textContent =
                data.review.comment;

            // Update Rating
            const ratingElement =
                card.querySelector(".starability-result");

            if (ratingElement) {

                ratingElement.setAttribute(
                    "data-rating",
                    data.review.rating
                );

            }

            // Update Edit Button Dataset
            const editBtn =
                card.querySelector(".edit-review-btn");

            if (editBtn) {

                editBtn.dataset.comment =
                    data.review.comment;

                editBtn.dataset.rating =
                    data.review.rating;

            }

            saveBtn.disabled = false;

            saveBtn.innerHTML = `
                <i class="fa-solid fa-floppy-disk"></i>
                    Save Changes
            `  ;

            // Close Modal
            bootstrap.Modal
                .getInstance(
                    document.getElementById("editReviewModal")
                )
                .hide();

            Swal.fire({

                icon: "success",

                title: "Review Updated!",

                timer: 1500,

                showConfirmButton: false

            });

        } catch (err) {

            saveBtn.disabled = false;

                saveBtn.innerHTML = `
                    <i class="fa-solid fa-floppy-disk"></i>
                    Save Changes
                ` ;

            console.error(err);

            Swal.fire({

                icon: "error",

                title: "Unable to update review"

            });

        }

    });

}

/* ==========================================
        AJAX DELETE REVIEW
========================================== */

document.addEventListener("submit", async function (e) {

    const form = e.target.closest(".delete-review-form");

    if (!form) return;

    e.preventDefault();

    const result = await Swal.fire({

        title: "Delete Review?",

        text: "This action cannot be undone.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Delete",

        cancelButtonText: "Cancel"

    });

    if (!result.isConfirmed) return;

    const reviewId = form.dataset.reviewId;

    try {

        const response = await fetch(form.action, {

            method: "POST",

            headers: {

                Accept: "application/json"

            }

        });

        const data = await response.json();

        if (!data.success) {

            throw new Error("Unable to delete review");

        }

        // Remove Review Card
        const card = document.getElementById(`review-${reviewId}`);

        if (card) {

            card.remove();

        }

        // Update Review Stats
        updateReviewStats(data);

        // Show Empty State if Needed
        showNoReviewMessage();

        Swal.fire({

            icon: "success",

            title: "Review Deleted!",

            timer: 1500,

            showConfirmButton: false

        });

    } catch (err) {

        console.error(err);

        Swal.fire({

            icon: "error",

            title: "Unable to delete review"

        });

    }

});