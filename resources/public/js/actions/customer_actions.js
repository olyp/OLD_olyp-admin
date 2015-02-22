var CUSTOMER_ACTIONS = (function () {
    function customerActionsFactory(router, customerStore) {
        return {
            showFormForEditCustomer: function (customer) {
                switch (customer.type) {
                case "company":
                    router.transitionTo("companyCustomerEdit", {customerId: customer.id});
                    break;
                case "person":
                    router.transitionTo("personCustomerEdit", {customerId: customer.id});
                    break;
                default:
                    throw new Error("Unknown customer type " + customer.type);
                }
            },

            updateCompanyCustomer: function (customer, data) {
                customerStore.updateCompanyCustomer(customer.id, data).then(
                    function () {
                        router.transitionTo("customers");
                    },
                    function (err) {
                        alert("An unknown error occurred: " + err);
                    }
                );
            },

            cancelEditCustomer: function () {
                router.transitionTo("customers");
            }
        }
    }

    return {
        create: customerActionsFactory
    }
}());
