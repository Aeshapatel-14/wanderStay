/* ==========================================
        AJAX WISHLIST
========================================== */

document.querySelectorAll(".wishlist-form").forEach((form) => {

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const button = form.querySelector(".wishlist-btn");
        const icon = button.querySelector("i");

        // Prevent multiple clicks
        button.disabled = true;

        try {

            const response = await fetch(form.action, {

                method: "POST",

                headers: {

                    Accept: "application/json"

                }

            });

            if (!response.ok) {

                throw new Error("Something went wrong.");

            }

            const data = await response.json();

            if (data.success) {

                if (data.wishlisted) {

                    icon.classList.remove("fa-regular");
                    icon.classList.add("fa-solid");

                    button.classList.add("active");

                } else {

                    icon.classList.remove("fa-solid");
                    icon.classList.add("fa-regular");

                    button.classList.remove("active");

                }

                // Heart Animation
                button.classList.add("animate");

                setTimeout(() => {

                    button.classList.remove("animate");

                }, 450);

            }

                    Swal.fire({

                        toast: true,

                        position: "top-end",

                        icon: "success",

                        title: data.wishlisted
                       ? "Added to Wishlist"
                        : "Removed from Wishlist",

                        showConfirmButton: false,

                        timer: 1400,

                         timerProgressBar: true

                    });

        } catch (err) {

            console.error(err);

            Swal.fire({

                 icon: "error",

                 title: "Something went wrong",

                text: "Please try again."

            });

        } finally {

            button.disabled = false;

        }

    });

});