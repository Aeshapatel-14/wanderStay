
/* ==========================================
        WANDERLUST
========================================== */

console.log("🚀 Wanderlust Loaded Successfully!");




// =======================================
// RECENTLY VIEWED LISTINGS
// =======================================

document.addEventListener("DOMContentLoaded", async () => {

    const section = document.getElementById("recentlyViewedSection");
    const container = document.getElementById("recentlyViewedContainer");

    if (!section || !container) return;

    const recentIds =
        JSON.parse(localStorage.getItem("recentListings")) || [];

    if (recentIds.length === 0) return;

    try {

        const response = await fetch("/listings/recent-listings", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                ids: recentIds
            })

        });

        const listings = await response.json();

        if (!listings.length) return;

        section.classList.remove("d-none");

        listings.forEach((listing) => {

            container.innerHTML += `
 

                <a href="/listings/${listing._id}"
                   class="text-decoration-none">

                    <div class="card listing-card h-100">

                        <img
                            src="${listing.image.url}"
                            class="card-img-top"
                            style="height:110px;object-fit:cover;">

                        <div class="card-body">

                            <h6 class="mb-2">
                                ${listing.title}
                            </h6>

                            <p class="text-muted mb-2">

                                <i class="fa-solid fa-location-dot"></i>

                                ${listing.location}

                            </p>

                            <strong>₹${listing.price}</strong>

                        </div>

                    </div>

                </a>

            </div>

            `;

        });

    } catch (err) {

        console.log(err);

    }

});

// ==========================
// RECENT SLIDER
// ==========================

const prevBtn = document.getElementById("recentPrev");
const nextBtn = document.getElementById("recentNext");
const slider = document.getElementById("recentlyViewedContainer");

if(prevBtn && nextBtn && slider){

    prevBtn.addEventListener("click",()=>{

        slider.scrollBy({

            left:-320,

            behavior:"smooth"

        });

    });

    nextBtn.addEventListener("click",()=>{

        slider.scrollBy({

            left:320,

            behavior:"smooth"

        });

    });

}

// ======================================
// SAVE RECENTLY VIEWED LISTING
// ======================================

function saveRecentlyViewed(listingId) {

    let recent =
        JSON.parse(localStorage.getItem("recentListings")) || [];

    recent = recent.filter(id => id !== listingId);

    recent.unshift(listingId);

    recent = recent.slice(0, 8);

    localStorage.setItem(
        "recentListings",
        JSON.stringify(recent)
    );

    console.log("Recently viewed:", recent);
}


// ======================================
// DETECT CURRENT LISTING
// ======================================

const listingPageData =
    document.getElementById("listingPageData");

if (listingPageData) {

    const listingId =
        listingPageData.dataset.listingId;

    if (listingId) {
        saveRecentlyViewed(listingId);
    }

}

// ======================================
// SIMILAR LISTINGS SLIDER
// ======================================

const similarSlider =
    document.getElementById("similarListingsSlider");

const similarPrev =
    document.getElementById("similarPrev");

const similarNext =
    document.getElementById("similarNext");


if (
    similarSlider &&
    similarPrev &&
    similarNext
) {

    similarPrev.addEventListener("click", () => {

        similarSlider.scrollBy({

            left: -320,

            behavior: "smooth"

        });

    });


    similarNext.addEventListener("click", () => {

        similarSlider.scrollBy({

            left: 320,

            behavior: "smooth"

        });

    });

}

