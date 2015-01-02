(function (GLOBAL) {
    function usersStoreFactory() {
        var usersAppInst;
        var users = [];

        return {
            setUsersAppInst: function (inst) {
                usersAppInst = inst;
            },

            setUsers: function (newUsers) {
                users = newUsers;
                usersAppInst.forceUpdate();
            },

            getUsers: function () {
                return users;
            }
        };
    }

    GLOBAL.USERS_STORE_FACTORY = usersStoreFactory;
}(this));
