var CUSTOMER_STORE = (function () {
    function processCustomerData(data) {
        var res = JSON.parse(JSON.stringify(data));
        delete res.type;
        if (res["room_booking_free_hours"]) {
            res["room_booking_free_hours"] = parseInt(res["room_booking_free_hours"], 10);
        }
        return res;
    }

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

            createCompanyCustomer: function (data) {
                return STORE_UTILS.prettyErr(http("POST", "/central_api_proxy/company_customers", processCustomerData(data)));
            },

            createPersonCustomer: function (data) {
                return STORE_UTILS.prettyErr(http("POST", "/central_api_proxy/person_customers", processCustomerData(data)));
            },

            updateCompanyCustomer: function (customerId, data) {
                return STORE_UTILS.prettyErr(http("PUT", "/central_api_proxy/company_customers/" + customerId, processCustomerData(data)));
            },

            updatePersonCustomer: function (customerId, data) {
                return STORE_UTILS.prettyErr(http("PUT", "/central_api_proxy/person_customers/" + customerId, processCustomerData(data)));
            }
        }
    }

    return {
        create: customerStoreFactory
    }
}());
