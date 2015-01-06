(function (GLOBAL) {
    function usersStoreFactory(customers) {
        var usersAppInst;
        var users = [];
        var currentUserForm = "new";
        var userToEdit = null;

        return {
            getCustomers: function () {
                return customers;
            },

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
                userToEdit = user;
                usersAppInst.forceUpdate();
            }
        };
    }

    GLOBAL.USERS_STORE_FACTORY = usersStoreFactory;
}(this));
