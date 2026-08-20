//  BOOKING AVAILABILITY CHECK

document.addEventListener("DOMContentLoaded", async () => {

    const bookingForm =
        document.getElementById("bookingForm");

    if (!bookingForm) return;

// LOAD BOOKED DATES

const listingId = bookingForm.action
    .split("/listings/")[1]
    .split("/bookings")[0];

let bookedDates = [];

// CHECK DATE RANGE AVAILABILITY

function isDateRangeAvailable(checkIn, checkOut) {

    if (!checkIn || !checkOut) {
        return true;
    }

    const selectedCheckIn =
        new Date(checkIn + "T00:00:00");

    const selectedCheckOut =
        new Date(checkOut + "T00:00:00");


    // Check selected range against
    // every existing booking

    return !bookedDates.some((booking) => {

        const bookedCheckIn =
            new Date(booking.checkIn);

        const bookedCheckOut =
            new Date(booking.checkOut);


        // Date overlap condition

        return (
            selectedCheckIn < bookedCheckOut &&
            selectedCheckOut > bookedCheckIn
        );

    });

}

try {

    const response = await fetch(
        `/listings/${listingId}/bookings/availability`,
        {
            headers: {
                "Accept": "application/json"
            }
        }
    );

    const data = await response.json();

    if (data.success) {

        bookedDates = data.bookings;

        console.log(
            "Booked dates:",
            bookedDates
        );

    }

} catch (error) {

    console.error(
        "Unable to load booked dates:",
        error
    );

}

//  BOOKED DATES CALENDAR
  
const checkInInput =
    document.getElementById("checkIn");

const checkOutInput =
    document.getElementById("checkOut");

    const guestsInput =
    document.getElementById("guests");

const summaryCheckIn =
    document.getElementById("summaryCheckIn");

const summaryCheckOut =
    document.getElementById("summaryCheckOut");

const summaryGuests =
    document.getElementById("summaryGuests");

    const priceSummaryText =
    document.getElementById("priceSummaryText");

const totalPriceElement =
    document.getElementById("totalPrice");

const finalPriceElement =
    document.getElementById("finalPrice");

const pricePerNight =
    Number(bookingForm.dataset.price);


let checkOutPicker;

function calculateBookingPrice() {

    const checkIn =
        checkInInput.value;

    const checkOut =
        checkOutInput.value;

        if (
            !checkIn ||
            !checkOut ||
            isNaN(new Date(checkIn + "T00:00:00").getTime()) ||
            isNaN(new Date(checkOut + "T00:00:00").getTime())
        ) {

            priceSummaryText.textContent =
                "Select your dates";

            totalPriceElement.textContent =
                "₹0";

            finalPriceElement.textContent =
                 "₹0";

        return;
    }

  if (!checkIn || !checkOut) {

    priceSummaryText.textContent =
        "Select your dates";

    totalPriceElement.textContent = "₹0";

    finalPriceElement.textContent = "₹0";

    return;
}

    const startDate =
        new Date(checkIn + "T00:00:00");

    const endDate =
        new Date(checkOut + "T00:00:00");

    const difference =
        endDate.getTime() -
        startDate.getTime();

    const nights =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );

    if (nights <= 0) {

         priceSummaryText.textContent =
        "Select your dates";

        totalPriceElement.textContent = "₹0";

        finalPriceElement.textContent = "₹0";

        return;
    }

    const total =
    pricePerNight * nights;

priceSummaryText.textContent =
    `₹${pricePerNight.toLocaleString("en-IN")} × ${nights} nights`;

totalPriceElement.textContent =
    "₹" + total.toLocaleString("en-IN");

finalPriceElement.textContent =
    "₹" + total.toLocaleString("en-IN");
} 

function updateBookingSummary() {

    // CHECK-IN

    if (checkInInput.value) {

        const checkInDate =
            new Date(
                checkInInput.value + "T00:00:00"
            );

        summaryCheckIn.textContent =
            checkInDate.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

    } else {

        summaryCheckIn.textContent =
            "—";
    }


    // CHECK-OUT

    if (checkOutInput.value) {

        const checkOutDate =
            new Date(
                checkOutInput.value + "T00:00:00"
            );

        summaryCheckOut.textContent =
            checkOutDate.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

    } else {

        summaryCheckOut.textContent =
            "—";
    }


    // GUESTS

    const guests =
        Number(guestsInput.value) || 1;

    summaryGuests.textContent =
        guests === 1
            ? "1 guest"
            : `${guests} guests`;
}

// PRICE CALCULATION EVENTS

checkInInput.addEventListener(
    "change",
    calculateBookingPrice
);

checkOutInput.addEventListener(
    "change",
    calculateBookingPrice
);

guestsInput.addEventListener(
    "input",
    updateBookingSummary
);

// CHECK-IN CALENDAR

flatpickr(checkInInput, {

    dateFormat: "Y-m-d",

    minDate: "today",

    disable: [

        function (date) {

            return bookedDates.some((booking) => {

                const checkIn =
                    new Date(booking.checkIn);

                const checkOut =
                    new Date(booking.checkOut);

                checkIn.setHours(0, 0, 0, 0);
                checkOut.setHours(0, 0, 0, 0);

                return (
                    date >= checkIn &&
                    date < checkOut
                );

            });

        }

    ],

    onChange: function (
        selectedDates,
        dateStr
    ) {

        if (!dateStr) {

            checkOutPicker.clear();

                checkInInput.classList.remove   ("date-selected");
                checkOutInput.classList.remove("date-selected");

            return;

        }       
        // CHECK-OUT MINIMUM DATE
       
        const minCheckoutDate =
            new Date(
                dateStr + "T00:00:00"
            );

        minCheckoutDate.setDate(
            minCheckoutDate.getDate() + 1
        );
        if (isNaN(minCheckoutDate.getTime())) {
    return;
}

        checkOutPicker.set(
            "minDate",
            minCheckoutDate
        );

        checkOutPicker.clear();

        checkInInput.classList.add("date-selected");

        checkOutPicker.open();

    }

});

// CHECK-OUT CALENDAR

checkOutPicker =
    flatpickr(checkOutInput, {

        dateFormat: "Y-m-d",

        minDate: "today",

        disable: [

            function (date) {

                // No check-in selected
                if (!checkInInput.value) {
                    return false;
                }


                const selectedCheckIn =
                    new Date(
                        checkInInput.value +
                        "T00:00:00"
                    );

                selectedCheckIn.setHours(
                    0,
                    0,
                    0,
                    0
                );


                // Check every existing booking

                return bookedDates.some(
                    (booking) => {

                        const bookedCheckIn =
                            new Date(
                                booking.checkIn
                            );

                        const bookedCheckOut =
                            new Date(
                                booking.checkOut
                            );


                        bookedCheckIn.setHours(
                            0,
                            0,
                            0,
                            0
                        );

                        bookedCheckOut.setHours(
                            0,
                            0,
                            0,
                            0
                        );


                        // Checkout date that creates
                        // an overlapping stay is disabled.

                        return (
                            date > bookedCheckIn &&
                            selectedCheckIn < bookedCheckOut &&
                            date < bookedCheckOut
                        );

                    }
                );

            }

        ],

     onChange: function (
    selectedDates,
    dateStr
) {

    if (
        !dateStr ||
        !checkInInput.value
    ) {
        return;
    }

    calculateBookingPrice();

    updateBookingSummary();

}

    });
// FORM VALIDATION

    bookingForm.addEventListener("submit", async function (e) {

        e.preventDefault();

    // DATE RESTRICTIONS
    
    const checkInInput =
        document.getElementById("checkIn");

    const checkOutInput =
        document.getElementById("checkOut");


    if (checkInInput && checkOutInput) {

        // Today's date
        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(today.getMonth() + 1).padStart(2, "0");

        const day =
            String(today.getDate()).padStart(2, "0");

        const todayString =
            `${year}-${month}-${day}`;


        // Check-in cannot be in the past
        checkInInput.min = todayString;

        // CHECK-IN CHANGE

        checkInInput.addEventListener("change", () => {

            if (!checkInInput.value) {

                checkOutInput.value = "";

                checkOutInput.min = todayString;

                return;

            }

            const selectedDate =
                new Date(checkInInput.value + "T00:00:00");


            selectedDate.setDate(
                selectedDate.getDate() + 1
            );


            const minCheckOutYear =
                selectedDate.getFullYear();

            const minCheckOutMonth =
                String(
                    selectedDate.getMonth() + 1
                ).padStart(2, "0");

            const minCheckOutDay =
                String(
                    selectedDate.getDate()
                ).padStart(2, "0");


            const minCheckOutDate =
                `${minCheckOutYear}-${minCheckOutMonth}-${minCheckOutDay}`;


            checkOutInput.min =
                minCheckOutDate;

            if (
                checkOutInput.value &&
                checkOutInput.value < minCheckOutDate
            ) {

                checkOutInput.value = "";

            }

           
            // CHECK SELECTED DATES AVAILABILITY

            if (
                checkOutInput.value &&
                !isDateRangeAvailable(
                checkInInput.value,
                checkOutInput.value
            )
        ) {

            Swal.fire({

                icon: "warning",

                title: "Dates Unavailable",

                text:
                    "These dates are already booked. Please select different dates.",

                confirmButtonText: "OK"

            });

            checkOutInput.value = "";

        }

     });

    }

// CHECK-OUT DATE AVAILABILITY

checkOutInput.addEventListener("change", async () => {

    if (checkOutInput.value) {
    checkOutInput.classList.add("date-selected");
    }

    if (
        !checkInInput.value ||
        !checkOutInput.value
    ) {
        return;
    }


    const available = isDateRangeAvailable(
        checkInInput.value,
        checkOutInput.value
    );


    if (!available) {

        await Swal.fire({

            icon: "error",

            title: "Dates Unavailable",

            text:
                "This listing is already booked for the selected dates. Please choose different dates.",

            confirmButtonText: "OK"

        });

        checkOutInput.value = "";

        checkOutInput.classList.remove("date-selected");

    }

});

        // FORM VALIDATION

        if (!bookingForm.checkValidity()) {

            bookingForm.reportValidity();

            return;

        }

        // SUBMIT BUTTON

        const submitBtn =
            bookingForm.querySelector(
                'button[type="submit"]'
            );

        if (!submitBtn) return;


        const originalText =
            submitBtn.innerHTML;


        submitBtn.disabled = true;


        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Checking availability...
        `;


        try {
            // SEND BOOKING DATA

            const formData =
                new FormData(bookingForm);


            const response = await fetch(
                bookingForm.action,
                {

                    method: "POST",

                    headers: {

                        "Accept": "application/json",

                        "X-Requested-With":
                            "XMLHttpRequest"
                    },

                    body:
                        new URLSearchParams(formData)

                }
            );

            // GET JSON RESPONSE

            const data =
                await response.json();

            // BOOKING NOT AVAILABLE

            if (
                !response.ok ||
                !data.success
            ) {

                await Swal.fire({

                    icon: "error",

                    title: "Booking Unavailable",

                    text:
                        data.message ||
                        "This listing is not available for the selected dates.",

                    confirmButtonText: "OK"

                });

                submitBtn.disabled = false;

                submitBtn.innerHTML =
                    originalText;

                return;

            }
            // SUCCESSFUL BOOKING

            window.location.href =
                data.redirectUrl;


        } catch (error) {

            console.error(
                "Booking error:",
                error
            );
            await Swal.fire({

                icon: "error",

                title: "Something went wrong",

                text:
                    "Unable to process your booking. Please try again.",

                confirmButtonText: "OK"

            });

            submitBtn.disabled = false;

            submitBtn.innerHTML =
                originalText;
        }

    });


    //  CANCEL BOOKING CONFIRMATION

document.addEventListener("DOMContentLoaded", () => {

    const cancelForms =
        document.querySelectorAll(
            'form[action*="/my-bookings/"][action*="/cancel"]'
        );

    cancelForms.forEach(form => {

        form.addEventListener("submit", async function (e) {

            e.preventDefault();

            const result = await Swal.fire({

                icon: "warning",

                title: "Cancel Booking?",

                text: "Are you sure you want to cancel this booking?",

                showCancelButton: true,

                confirmButtonText: "Yes, cancel it",

                cancelButtonText: "No, keep it",

                reverseButtons: true

            });

            if (result.isConfirmed) {

                form.submit();

            }

        });

    });

});

});
