var CUSTOMER_STORE = (function () {
    function customerStoreFactory(http) {
        return {
            getAllCustomers: function () {
                return http("GET", "/central_api_proxy/customers");
            }
        }
    }

    return {
        create: customerStoreFactory
    }
}());
