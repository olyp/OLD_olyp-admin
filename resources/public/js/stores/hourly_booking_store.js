var HOURLY_BOOKING_STORE = (function () {
    function createHourlyBookingStore(http) {
        return {
            getRecentlyDeletedHourlyBookings: function () {
                return http("GET", "/central_api_proxy/recently_deleted_bookings");
            },

            getUnbatchedBookings: function () {
                return http("GET", "/central_api_proxy/unbatched_bookings");
            },

            getHourlyBookingBatches: function () {
                return http("GET", "/central_api_proxy/hourly_booking_batches");
            },

            getHourlyBookingBatch: function (batchId) {
                return http("GET", "/central_api_proxy/hourly_booking_batches/" + batchId);
            },

            createBatch: function (year, month) {
                return STORE_UTILS.prettyErr(http("POST", "/central_api_proxy/hourly_booking_batches", {year: year, month: month}));
            },

            addHourlyBookingsToBatch: function (batchId, hourlyBookingIds) {
                return STORE_UTILS.prettyErr(http("POST", "/central_api_proxy/hourly_booking_batches/" + batchId + "/hourly_bookings", {hourly_booking_ids: hourlyBookingIds}));
            },

            unbatchHourlyBookings: function (batchId, hourlyBookingIds) {
                return STORE_UTILS.prettyErr(http("DELETE", "/central_api_proxy/hourly_booking_batches/" + batchId + "/hourly_bookings", {hourly_booking_ids: hourlyBookingIds}));
            }
        }
    }

    return {
        create: createHourlyBookingStore
    }
}());
