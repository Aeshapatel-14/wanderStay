🏡 WanderStay

  A full-stack stay booking web application inspired by modern vacation-rental platforms.
    WanderStay allows users to explore properties, 
    search and filter listings, manage wishlists, 
    write reviews, and book available stays.
  
Live Demo
    Live Website: 

GitHub Repository:
    https://github.com/Aeshapatel-14/wanderlust

|----------------------------|
|         Features           |
|----------------------------|

A) Authentication

  * User registration and login
  * Logout functionality
  * Session-based authentication
  * Protected routes
  * Authorization for user-specific actions

B) Listings

  * Create, view, edit, and delete listings
  * Image upload using Cloudinary
  * Listing validation
  * Search listings by destination
  * Category-based filtering
  * Responsive listing cards

C) Wishlist

  * Add and remove listings from wishlist
  * Dedicated wishlist page
  * Dynamic wishlist interaction

D) Reviews

  * Add reviews
  * Edit reviews
  * Delete reviews
  * Review validation

E) Booking System

  * Check-in and check-out date selection
  * Guest selection
  * Automatic stay duration calculation
  * Automatic total price calculation
  * Real-time booking availability checking
  * Previously booked dates are disabled
  * Prevents overlapping bookings
  * Booking confirmation page
  * Booking details page
  * My Bookings page
  * Booking cancellation
  * Booking status management

F) Responsive Design

  * Responsive desktop layout
  * Tablet-friendly interface
  * Mobile-friendly interface
  * Responsive navbar and search
  * Responsive listing and booking pages
  * Responsive forms and cards


|----------------------------|
|         Tech Stack         |
|----------------------------|
 
 a) Frontend

  * HTML5
  * CSS3
  * JavaScript
  * EJS
  * Bootstrap
  * Font Awesome
  * SweetAlert2

b) Backend

  * Node.js
  * Express.js

c) Database

  * MongoDB
  * Mongoose

d) Authentication & Sessions

  * Express Session
  * Connect-Mongo

e) Image Storage

  * Cloudinary
  * Multer

f) Validation & Utilities

  * Joi
  * Method Override
  * Connect Flash
  * EJS Mate


|----------------------------|
|        Booking Flow        |
|----------------------------|

  1. User opens a listing.
  2. User selects check-in and check-out dates.
  3. The application checks existing bookings.
  4. Already booked dates are disabled.
  5. User selects the number of guests.
  6. Total nights and booking price are calculated automatically.
  7. The booking is created if the selected dates are available.
  8. User can view the booking confirmation and booking details.
  9. Confirmed bookings can be cancelled from the booking management section.

The availability system prevents users from booking dates that are already reserved.


|----------------------------|
|      Project Structure     |
|----------------------------|

wanderstay/
│
├── controllers/
│   ├── bookings.js
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/
│   ├── booking.js
│   ├── listing.js
│   └── user.js
│
├── routes/
│   ├── bookings.js
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/
│   ├── bookings/
│   ├── listings/
│   ├── users/
│   ├── includes/
│   └── layouts/
│
├── public/
│   ├── css/
│   └── js/
│
├── init/
│
├── app.js
├── middleware.js
├── schema.js
├── package.json
└── README.md


---

|----------------------------|
|        Installation        |
|----------------------------|

 1. Clone the repository

    git clone https://github.com/Aeshapatel-14/wanderlust.git


 2. Navigate to the project

    cd wanderlust

 3. Install dependencies

    npm install

 4. Configure environment variables

    Create a `.env` file in the root directory:

 5. Start the application

    npm start or npm run dev
     
 6. For development:
    nodemon app.js


|----------------------------|
|    Environment Variables   |
|----------------------------|

  * MongoDB connection
  * Session secret
  * Cloudinary configuration
    

|----------------------------|
|         Screenshot         |
|----------------------------|

  * Listings page
  * Listing details page
  * Booking section
  * Booking confirmation
  * My Bookings
  * Wishlist
  * Login / Signup
  * Mobile responsive view


|----------------------------|
|        Future plan         |
|----------------------------|

  * Online payment integration
  * Admin dashboard
  * Host dashboard
  * Booking analytics
  * Advanced search and filtering
  * Recently viewed listings
  * Additional performance optimizations

|----------------------------|
|        What i learn        |
|----------------------------|

  * MVC architecture
  * RESTful routing
  * CRUD operations
  * Authentication and authorization
  * MongoDB and Mongoose
  * Session management
  * Image upload and cloud storage
  * Form validation
  * Booking and date availability logic
  * Responsive web design
  * Git and GitHub workflow

|----------------------------|
|           Author           |
|----------------------------|

Aesha Patel

GitHub:
https://github.com/Aeshapatel-14
