const bookingController = require("../controllers/bookings.js");

const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const {
    createBooking,
    myBookings,
    cancelBooking,
    confirmation
} = require("../controllers/bookings.js");

const { isLogedIn } = require("../middleware.js");


// ======================================
// MY BOOKINGS
// ======================================

router.get(
    "/my-bookings",
    isLogedIn,
    wrapAsync(bookingController.myBookings)
);

// ======================================
// CANCEL BOOKING
// ======================================

router.post(
    "/my-bookings/:bookingId/cancel",
    isLogedIn,
    wrapAsync(cancelBooking)
);

// ======================================
// BOOKING CONFIRMATION
// ======================================

router.get(
    "/bookings/:bookingId/confirmation",
    isLogedIn,
    wrapAsync(confirmation)
);

// ======================================
// BOOKING AVAILABILITY
// ======================================

router.get(

    "/listings/:id/bookings/availability",

    isLogedIn,

    wrapAsync(bookingController.getAvailability)

);
// ============================
// CREATE BOOKING
// ============================

router.post(
    "/listings/:id/bookings",
    isLogedIn,
    wrapAsync(bookingController.createBooking)
);

// ======================================
// BOOKING DETAILS
// ======================================

router.get(
    "/bookings/:bookingId",
    isLogedIn,
    wrapAsync(bookingController.bookingDetails)
);

module.exports = router;