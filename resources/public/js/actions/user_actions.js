var USER_ACTIONS = (function () {
    function userActionsFactory(router, userStore) {
        return {
            showFormForCreateUser: function () {
                router.transitionTo("userNew");
            },

            showFormForEditUser: function (user) {
                router.transitionTo("userEdit", {userId: user.id});
            },

            cancelEditUser: function () {
                router.transitionTo("users");
            },

            createUser: function (data) {
                userStore.createUser(data).then(
                    function () {
                        router.transitionTo("users");
                    },
                    function (err) {
                        alert("An unknown error occurred: " + err);
                    }
                );
            },

            updateUser: function (user, data) {
                userStore.updateUser(user.id, data).then(
                    function () {
                        router.transitionTo("users");
                    },
                    function (err) {
                        alert("An unknown error occurred: " + err);
                    }
                );
            },

            showFormForChangeUserPassword: function (user) {
                router.transitionTo("userChangePassword", {userId: user.id})
            },

            changeUserPassword: function (user, password) {
                userStore.changePassword(user.id, password).then(
                    function () {
                        router.transitionTo("users");
                    },
                    function () {
                        alert("An unknown error occurred: " + err);
                    }
                );
            }
        }
    }

    return {
        create: userActionsFactory
    }
}());
