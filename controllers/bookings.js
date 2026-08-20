const mongoose = require("mongoose");
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

// CHECK BOOKING AVAILABILITY

module.exports.getAvailability = async (req, res) => {

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {

        return res.status(400).json({
            success: false,
            message: "Invalid listing ID."
        });

    }

    const bookings = await Booking.find({

        listing: id,

        status: {
            $ne: "Cancelled"
        }

    }).select("checkIn checkOut");

    const bookedDates = bookings.map((booking) => ({

        checkIn: booking.checkIn,

        checkOut: booking.checkOut

    }));

    return res.json({
        success: true,
        bookings: bookedDates
    });

};

// CREATE BOOKING

module.exports.createBooking = async (req, res) => {

    const { id } = req.params;

    const {
    checkIn,
    checkOut,
    guests
} = req.body || {};

    // FIND LISTING

    const listing = await Listing.findById(id);

    if (!listing) {

        req.flash(
            "error",
            "Listing not found."
        );

        return res.redirect("/listings");

    }

// VALIDATE GUESTS

const guestCount = Number(guests);

if (
    !Number.isInteger(guestCount) ||
    guestCount < 1
) {

    req.flash(
        "error",
        "Please enter a valid number of guests."
    );

    return res.redirect(`/listings/${id}`);
}

    // CONVERT DATES

    const startDate = new Date(checkIn);

    const endDate = new Date(checkOut);

    // BASIC DATE VALIDATION

    if (
        isNaN(startDate.getTime()) ||
        isNaN(endDate.getTime())
    ) {

        req.flash(
            "error",
            "Please select valid check-in and check-out dates."
        );

        return res.redirect(`/listings/${id}`);

    }


    if (endDate <= startDate) {

        req.flash(
            "error",
            "Check-out date must be after check-in date."
        );

        return res.redirect(`/listings/${id}`);

    }

    // CHECK PAST DATES

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (startDate < today) {

        req.flash(
            "error",
            "Check-in date cannot be in the past."
        );

        return res.redirect(`/listings/${id}`);

    }

    // CHECK EXISTING BOOKINGS

    const existingBooking = await Booking.findOne({

        listing: listing._id,

        status: {
            $ne: "Cancelled"
        },

        checkIn: {
            $lt: endDate
        },

        checkOut: {
            $gt: startDate
        }

    });

    // IF DATES ARE NOT AVAILABLE


 if (existingBooking) {

    const message =
        "Sorry, this listing is not available for the selected dates.";

    // AJAX request → JSON
    if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
    ) {

        return res.status(409).json({
            success: false,
            message
        });

    }

    // Normal request → Flash message
    req.flash("error", message);

    return res.redirect(`/listings/${id}`);

}
    // CALCULATE NIGHTS

    const timeDifference =
        endDate.getTime() - startDate.getTime();

    const totalNights =
        Math.ceil(
            timeDifference /
            (1000 * 60 * 60 * 24)
        );

    // CALCULATE TOTAL PRICE

    const totalPrice =
        listing.price * totalNights;

    // CREATE BOOKING

    const booking = new Booking({

        listing: listing._id,

        user: req.user._id,

        checkIn: startDate,

        checkOut: endDate,

        guests: guestCount,

        totalNights,

        totalPrice

    });


    await booking.save();

    // SUCCESS
    const redirectUrl =
        `/bookings/${booking._id}/confirmation`;

    // AJAX request → JSON
    if (
        req.headers.accept &&
            req.headers.accept.includes("application/json")
    ) {

    return res.json({
        success: true,
        redirectUrl
    });

}

    // Normal request → Flash + redirect
    req.flash(
        "success",
        "Your booking has been confirmed!"
    );

        return res.redirect(redirectUrl);

    };

// MY BOOKINGS

module.exports.myBookings = async (req, res) => {

    const bookings = await Booking.find({
        user: req.user._id
    })
    .populate("listing")
    .sort({
        createdAt: -1
    });

    // UPDATE COMPLETED BOOKINGS

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    for (const booking of bookings) {

        if (
            booking.status === "Confirmed" &&
            booking.checkOut < today
        ) {

            booking.status = "Completed";

            await booking.save();

        }
    }
    res.render("bookings/myBookings.ejs", {

        bookings
    });

};

// CANCEL BOOKING

module.exports.cancelBooking = async (req, res) => {

    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {

        req.flash(
            "error",
            "Booking not found."
        );

        return res.redirect("/my-bookings");
    }

// ALREADY CANCELLED

if (booking.status === "Cancelled") {

    req.flash(
        "error",
        "This booking is already cancelled."
    );

    return res.redirect("/my-bookings");
}

// CHECK COMPLETED BOOKING

if (booking.status === "Completed") {

    req.flash(
        "error",
        "Completed bookings cannot be cancelled."
    );

    return res.redirect("/my-bookings");
}
    // SECURITY CHECK

    if (
        booking.user.toString() !==
        req.user._id.toString()
    ) {

        req.flash(
            "error",
            "You are not authorized to cancel this booking."
        );

        return res.redirect("/my-bookings");
    }

    // ALREADY CANCELLED

    if (booking.status === "Cancelled") {

        req.flash(
            "error",
            "This booking is already cancelled."
        );

        return res.redirect("/my-bookings");
    }

    // CANCEL BOOKING

    booking.status = "Cancelled";

    await booking.save();

    req.flash(
        "success",
        "Your booking has been cancelled successfully!"
    );

    res.redirect("/my-bookings");

};

// BOOKING CONFIRMATION

module.exports.confirmation = async (req, res) => {

    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
        .populate("listing");

    // BOOKING NOT FOUND

    if (!booking) {

        req.flash(
            "error",
            "Booking not found."
        );

        return res.redirect("/my-bookings");
    }

    // SECURITY CHECK

    if (
        booking.user.toString() !==
        req.user._id.toString()
    ) {

        req.flash(
            "error",
            "You are not authorized to view this booking."
        );

        return res.redirect("/my-bookings");
    }

    // RENDER CONFIRMATION

    res.render(
        "bookings/confirmation.ejs",
        {
            booking
        }
    );

};

// BOOKING DETAILS

module.exports.bookingDetails = async (req, res) => {

    const { bookingId } = req.params;

    // VALIDATE BOOKING ID

    if (!mongoose.isValidObjectId(bookingId)) {

        req.flash(
            "error",
            "Invalid booking ID."
        );

        return res.redirect("/my-bookings");
    }

    // FIND BOOKING

    const booking = await Booking.findById(bookingId)
        .populate("listing");

    // SECURITY CHECK

    if (
        booking.user.toString() !==
        req.user._id.toString()
    ) {

        req.flash(
            "error",
            "You are not authorized to view this booking."
        );

        return res.redirect("/my-bookings");
    }

    // RENDER BOOKING DETAILS
    res.render(
        "bookings/bookingDetails.ejs",
        {
            booking
        }
    );

};

