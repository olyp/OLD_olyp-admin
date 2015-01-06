(function () {
    var csrfToken = document.querySelector("meta[name=csrf-token]");
    if (csrfToken) {
        var CSRF_TOKEN = csrfToken.getAttribute("content");
    } else {
        throw new Error("Unable to find CSRF token");
    }

    var http = OLYP_HTTP_FACTORY(CSRF_TOKEN)

    var apiUtils = {
        getAllUsers: function () {
            return http("GET", "/central_api_proxy/users");
        },

        createUser: function (userData) {
            return http("POST", "/central_api_proxy/users", userData);
        },

        updateUser: function (userId, userData) {
            return http("PUT", "/central_api_proxy/users/" + userId, userData);
        },

        deleteUser: function (userId) {
            return http("DELETE", "/central_api_proxy/users/" + userId);
        },

        changeUserPassword: function (userId, password) {
            return http("PUT", "/central_api_proxy/users/" + userId + "/password", {password: password});
        }
    };

    http("GET", "/central_api_proxy/customers").then(function (res) {
        var fluxStore = USERS_STORE_FACTORY(res);
        var fluxActions = USERS_ACTIONS_FACTORY(fluxStore, apiUtils);

        var usersAppInst = React.render(
            USERS_COMPONENTS.UsersApp({
                fluxActions: fluxActions,
                fluxStore: fluxStore
            }),
            document.getElementById("users-app"));

        fluxStore.setUsersAppInst(usersAppInst);
    })
}());
