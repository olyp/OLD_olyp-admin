var CUSTOMER_STORE = (function () {
    function customerStoreFactory(http) {
        return {
            getAllCustomers: function () {
                return http("GET", "/central_api_proxy/customers");
            },
            getAllCustomersById: function () {
                return STORE_UTILS.groupByUnique(
                    http("GET", "/central_api_proxy/customers"),
                    function (customer) { return customer.id; });
            }
        }
    }

    return {
        create: customerStoreFactory
    }
}());
