(function (GLOBAL) {
    function usersStoreFactory() {
        var usersAppInst;
        var users = [];
        var currentUserForm = "new";
        var userToEdit = null;

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
            },

            getCurrentUserForm: function () {
                return currentUserForm;
            },

            editUser: function (user) {
                currentUserForm = "edit";
                userToEdit = user;
                usersAppInst.forceUpdate();
            },

            getUserToEdit: function () {
                return userToEdit;
            },

            showNewUserForm: function () {
                currentUserForm = "new";
                usersAppInst.forceUpdate();
            },

            changeUserPassword: function (user) {
                currentUserForm = "changePassword";
                usersAppInst.forceUpdate();
            }
        };
    }

    GLOBAL.USERS_STORE_FACTORY = usersStoreFactory;
}(this));
