(function () {
    var csrfToken = document.querySelector("meta[name=csrf-token]");
    if (csrfToken) {
        var CSRF_TOKEN = csrfToken.getAttribute("content");
    } else {
        throw new Error("Unable to find CSRF token");
    }

    var http = OLYP_HTTP_FACTORY(CSRF_TOKEN)

    var apiUtils = {
        getAllItems: function () {
            return http("GET", "/central_api_proxy/contracts");
        },
        createItem: function (data) {
            var ourData = JSON.parse(JSON.stringify(data));
            delete ourData.type;

            switch (data.type) {
            case "company":
                return http("POST", "/central_api_proxy/company_contracts", ourData);
            case "person":
                return http("POST", "/central_api_proxy/person_contracts", ourData);
            }
        },
        updateItem: function (id, data) {
            var ourData = JSON.parse(JSON.stringify(data));
            delete ourData.type;

            switch (data.type) {
            case "company":
                return http("PUT", "/central_api_proxy/company_contracts/" + id, ourData);
            case "person":
                return http("PUT", "/central_api_proxy/person_contracts/" + id, ourData);
            }
        }
    };

    var crudFluxStore = REUSABLE_CRUD_STORE_FACTORY();
    var crudFluxActions = REUSABLE_CRUD_ACTIONS_FACTORY(crudFluxStore, apiUtils);

    var contractsAppInst = React.render(
        CONTRACTS_COMPONENTS.ContractsApp({
            crudFluxStore: crudFluxStore,
            crudFluxActions: crudFluxActions
        }),
        document.getElementById("contracts-app"));

    crudFluxStore.setComponentInst(contractsAppInst);
}());
