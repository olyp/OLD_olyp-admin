var MONTHLY_RENTAL_STORE = (function () {
    function monthlyRentalStoreFactory(http) {
        var totalMonthlyPrice = 0;

        return {
            getAllMonthlyRentalRooms: function () {
                return http("GET", "/central_api_proxy/rentable_rooms");
            },

            getMonthlyRentalsByRoom: function () {
                var promise = http("GET", "/central_api_proxy/customer_room_rental_agreements");
                promise.then(
                    function (agreements) {
                        totalMonthlyPrice = agreements.reduce(function (total, curr) {
                            return total + parseInt(curr["monthly_price"], 10);
                        }, 0)
                    });
                return STORE_UTILS.groupBy(
                    promise,
                    function (agreement) { return agreement.rentable_room_id; });
            },

            getTotalMonthlyPrice: function () {
                return totalMonthlyPrice;
            }
        }
    }

    return {
        create: monthlyRentalStoreFactory
    }
}());
