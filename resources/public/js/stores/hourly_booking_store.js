var HOURLY_BOOKING_STORE = (function () {
    function createHourlyBookingStore(http) {
        return {
            getRecentlyDeletedHourlyBookings: function () {
                return http("GET", "/central_api_proxy/recently_deleted_bookings");
            }
        }
    }

    return {
        create: createHourlyBookingStore
    }
}());
