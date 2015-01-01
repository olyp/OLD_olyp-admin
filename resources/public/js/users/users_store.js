(function (GLOBAL) {
    function usersStoreFactory() {
        var usersAppInst;
        return {
            setUsersAppInst: function (inst) {
                usersAppInst = inst;
            }
        };
    }

    GLOBAL.USERS_STORE_FACTORY = usersStoreFactory;
}(this));
