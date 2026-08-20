// ==============================
// PROFILE DROPDOWN
// ==============================

const profileMenu = document.querySelector(".profile-menu");
const dropdown = document.querySelector(".dropdown-menu-custom");
const arrow = document.querySelector(".dropdown-arrow");

if (profileMenu && dropdown) {

    profileMenu.addEventListener("click", (e) => {

        e.stopPropagation();

        if (dropdown.style.display === "flex") {

            dropdown.style.opacity = "0";
            dropdown.style.transform = "translateY(10px)";

            setTimeout(() => {
                dropdown.style.display = "none";
            }, 200);

            if (arrow) {
                arrow.style.transform = "rotate(0deg)";
            }

        } else {

            dropdown.style.display = "flex";

            setTimeout(() => {
                dropdown.style.opacity = "1";
                dropdown.style.transform = "translateY(0)";
            }, 10);

            if (arrow) {
                arrow.style.transform = "rotate(180deg)";
            }

        }

    });

    document.addEventListener("click", (e) => {

        if (!profileMenu.contains(e.target)) {

            dropdown.style.opacity = "0";
            dropdown.style.transform = "translateY(10px)";

            setTimeout(() => {
                dropdown.style.display = "none";
            }, 200);

            if (arrow) {
                arrow.style.transform = "rotate(0deg)";
            }

        }

    });

}

// ==============================
// SEARCH SUGGESTIONS
// ==============================

const searchInput = document.querySelector(".search-location");
const suggestionBox = document.getElementById("searchSuggestions");

let selectedIndex = -1;
let debounceTimer;

if (searchInput && suggestionBox) {

    // ==========================
    // SEARCH INPUT
    // ==========================

    searchInput.addEventListener("input", () => {

        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(async () => {

            const query = searchInput.value.trim();

            // Hide if less than 2 chars
            if (query.length < 2) {
                suggestionBox.innerHTML = "";
                suggestionBox.style.display = "none";
                selectedIndex = -1;
                return;
            }

            try {

                const response = await fetch(
                    `/listings/search-suggestions?q=${encodeURIComponent(query)}`
                );

                const suggestions = await response.json();

                suggestionBox.innerHTML = "";
                selectedIndex = -1;

                if (!suggestions.length) {
                    suggestionBox.style.display = "none";
                    return;
                }

                suggestions.forEach((item) => {

                    const div = document.createElement("div");

                    div.classList.add("search-item");

                    div.innerHTML = `
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${item}</span>
                    `;

                    div.addEventListener("click", () => {

                        searchInput.value = item;
                        suggestionBox.style.display = "none";

                    });

                    suggestionBox.appendChild(div);

                });

                suggestionBox.style.display = "block";

            } catch (err) {

                console.log(err);

            }

        }, 300);

    });

    // ==========================
    // KEYBOARD NAVIGATION
    // ==========================

    searchInput.addEventListener("keydown", (e) => {

        const items = suggestionBox.querySelectorAll(".search-item");

        if (!items.length) return;

        // Down Arrow
        if (e.key === "ArrowDown") {

            e.preventDefault();

            selectedIndex++;

            if (selectedIndex >= items.length) {
                selectedIndex = 0;
            }

            updateSelection(items);

        }

        // Up Arrow
        else if (e.key === "ArrowUp") {

            e.preventDefault();

            selectedIndex--;

            if (selectedIndex < 0) {
                selectedIndex = items.length - 1;
            }

            updateSelection(items);

        }

        // Enter
        else if (e.key === "Enter") {

            if (selectedIndex >= 0) {

                e.preventDefault();

                searchInput.value =
                    items[selectedIndex].querySelector("span").textContent;

                suggestionBox.style.display = "none";

            }

        }

    });

    // ==========================
    // CLICK OUTSIDE
    // ==========================

    document.addEventListener("click", (e) => {

        if (
            !searchInput.contains(e.target) &&
            !suggestionBox.contains(e.target)
        ) {

            suggestionBox.style.display = "none";

        }

    });

}

// ==============================
// UPDATE ACTIVE ITEM
// ==============================

function updateSelection(items) {

    items.forEach((item) => {

        item.classList.remove("active");

    });

    if (selectedIndex >= 0) {

        items[selectedIndex].classList.add("active");

        items[selectedIndex].scrollIntoView({
            block: "nearest"
        });
        

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {

        if (
            !searchInput.contains(e.target) &&
            !suggestionBox.contains(e.target)
        ) {

            suggestionBox.style.display = "none";

        }

    });

    }
}