var HOURLY_BOOKING_ACTIONS = (function () {
    function createHourlyBookingActions(router, hourlyBookingStore) {
        return {
            gotoUnbatched: function () {
                router.transitionTo("hourlyBookingsUnbatched");
            },

            gotoCreateBatch: function () {
                router.transitionTo("hourlyBookingsBatchNew");
            },

            gotoManageBatch: function (id) {
                router.transitionTo("hourlyBookingsBatchShow", {hourlyBookingBatchId: id});
            },

            createBatch: function (year, month) {
                hourlyBookingStore.createBatch(year, month).then(
                    function () {
                        router.transitionTo("hourlyBookings");
                    },
                    function (err) {
                        alert("An unknown error occurred: " + err);
                    }
                );
            },

            addHourlyBookingsToBatch: function (batchId, hourlyBookingIds) {
                hourlyBookingStore.addHourlyBookingsToBatch(batchId, hourlyBookingIds).then(
                    function () {
                        router.transitionTo("hourlyBookings");
                    },
                    function (err) {
                        alert("An unknown error occurred: " + err);
                    }
                );
            },

            unbatchHourlyBookings: function (batchId, hourlyBookingIds) {
                hourlyBookingStore.unbatchHourlyBookings(batchId, hourlyBookingIds).then(
                    function () {
                        router.transitionTo("hourlyBookings");
                    },
                    function (err) {
                        alert("An unknown error occurred: " + err);
                    }
                );
            }
        }
    }

    return {
        create: createHourlyBookingActions
    }
}());
