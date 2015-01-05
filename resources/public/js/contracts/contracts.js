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
            return http("POST", "/central_api_proxy/contracts", data);
        },
        updateItem: function (id, data) {
            return http("PUT", "/central_api_proxy/contracts/" + id, data);
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
