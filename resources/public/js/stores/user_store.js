var USER_STORE = (function () {
    function usersStoreFactory(http) {
        return {
            getAllUsers: function () {
                return http("GET", "/central_api_proxy/users");
            },

            getUser: function (userId) {
                return http("GET", "/central_api_proxy/users/" + userId);
            },

            createUser: function (data) {
                return http("POST", "/central_api_proxy/users", data);
            },

            updateUser: function (userId, data) {
                return http("PUT", "/central_api_proxy/users/" + userId, data);
            },

            changePassword: function (userId, password) {
                return http("PUT", "/central_api_proxy/users/" + userId + "/password", {password: password});
            }
        }
    }

    return {
        create: usersStoreFactory
    };
}());
