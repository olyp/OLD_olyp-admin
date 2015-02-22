var CUSTOMER_STORE = (function () {
    function customerStoreFactory(http) {
        return {
            getCompanyCustomer: function (id) {
                return http("GET", "/central_api_proxy/company_customers/" + id);
            },

            getPersonCustomer: function (id) {
                return http("GET", "/central_api_proxy/person_customers/" + id);
            },

            getAllCustomers: function () {
                return http("GET", "/central_api_proxy/customers");
            },
            getAllCustomersById: function () {
                return STORE_UTILS.groupByUnique(
                    http("GET", "/central_api_proxy/customers"),
                    function (customer) { return customer.id; });
            },

            updateCompanyCustomer: function (customerId, data) {
                return STORE_UTILS.prettyErr(http("PUT", "/central_api_proxy/company_customers/" + customerId, data));
            }
        }
    }

    return {
        create: customerStoreFactory
    }
}());
