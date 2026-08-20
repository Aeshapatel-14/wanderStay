
 
/* ==========================================
        BUTTON LOADING STATE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll("form");

   forms.forEach(form => {

    if (
        form.classList.contains("wishlist-form") ||
        form.id === "bookingForm"
    ) return;

        form.addEventListener("submit", function () {

            const submitBtn = form.querySelector(
                'button[type="submit"], button:not([type])'
            );

            if (!submitBtn) return;

            submitBtn.disabled = true;

            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2"></span>
                Please wait...
            `;

            // agar validation fail ho jaye to button wapas enable ho
            setTimeout(() => {

                if (!form.checkValidity()) {

                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;

                }

            }, 300);

        });

    });

});

/* ==========================================
        LOGIN LOADING
========================================== */

const loginForm = document.querySelector('form[action="/users/login"]');

if (loginForm) {

    loginForm.addEventListener("submit", function () {

        if (!loginForm.checkValidity()) return;

        const btn = document.getElementById("loginBtn");

        btn.disabled = true;

        btn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Logging in...
        `;

        
    });

}

/* ==========================================
        SIGNUP LOADING
========================================== */

const signupForm = document.querySelector('form[action="/users/signup"]');

if (signupForm) {

    signupForm.addEventListener("submit", function () {

        if (!signupForm.checkValidity()) return;

        const btn = document.getElementById("signupBtn");

        btn.disabled = true;

        btn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Creating Account...
        `;

    });

}

/* ==========================================
        ADD LISTING LOADING
========================================== */

const addListingForm = document.querySelector('form[action="/listings"]');

if (addListingForm) {

    addListingForm.addEventListener("submit", function () {

        if (!addListingForm.checkValidity()) return;

        const btn = document.getElementById("addListingBtn");

        btn.disabled = true;

        btn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Publishing Listing...
        `;

    });

}

/* ==========================================
        EDIT LISTING LOADING
========================================== */

const editListingForm = document.querySelector(
    'form[action*="?_method=PUT"]'
);

if (editListingForm) {

    editListingForm.addEventListener("submit", function () {

        if (!editListingForm.checkValidity()) return;

        const btn = document.getElementById("editListingBtn");

        btn.disabled = true;

        btn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Saving Changes...
        `;

    });

}
/* ==========================================
        SEARCH LOADING
========================================== */

const searchForm = document.querySelector(".search-bar");

if (searchForm) {

    searchForm.addEventListener("submit", function (e) {

        const searchInput =
            searchForm.querySelector('input[name="search"]');

        // Remove extra spaces
        searchInput.value = searchInput.value.trim();

        // Prevent empty search
        if (searchInput.value === "") {

            e.preventDefault();

            searchInput.focus();

            return;

        }

        const btn = document.getElementById("searchBtn");

        if (!btn) return;

        btn.disabled = true;

        btn.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
        `;

    });

}
