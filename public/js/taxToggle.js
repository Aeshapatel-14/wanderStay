//   togler button

const taxSwitch = document.getElementById("switchCheckDefault");

if (taxSwitch) {

    const prices = document.querySelectorAll(".listing-price");
    const taxInfo = document.querySelectorAll(".tax-info");

    function updatePrices() {

        prices.forEach((price, index) => {

            const original = Number(price.dataset.price);

            if (taxSwitch.checked) {

                const total = Math.round(original * 1.15);

                price.innerHTML =
                    `₹${total.toLocaleString("en-IN")}`;

                taxInfo[index].innerHTML =
                    "Includes all taxes";

                taxInfo[index].style.display = "inline";

            } else {

                price.innerHTML =
                    `₹${original.toLocaleString("en-IN")}`;

                taxInfo[index].innerHTML =
                    "+15% GST";

                taxInfo[index].style.display = "inline";
            }

        });

    }

    updatePrices();

    taxSwitch.addEventListener("change", updatePrices);

}