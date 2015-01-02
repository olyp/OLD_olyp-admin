(function (GLOBAL) {
    var PASSWORD_CHARS = "abcdefghjkmnpqrstuvwxyz23456789";
    var PASSWORD_SIZE = 10;

    function usersActionsFactory(fluxStore, apiUtils) {
        function fetchUsers() {
            apiUtils.getAllUsers().then(
                function (res) {
                    fluxStore.setUsers(res);
                },
                function (e) {
                    alert("An unknown error occurred: " + JSON.stringify(e));
                }
            );
        }

        fetchUsers();

        return {
            generateRandomPassword: function () {
                var res = [];

                if (window.crypto && window.Uint32Array) {
                    var array = new Uint32Array(PASSWORD_SIZE)
                    window.crypto.getRandomValues(array);
                    for (var i = 0; i < array.length; i++) {
                        res.push(PASSWORD_CHARS[array[i] % PASSWORD_CHARS.length]);
                    }
                } else {
                    for (var i = 0; i < PASSWORD_SIZE; i++) {
                        res.push(PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)]);
                    }
                }

                return res.join("");
            },

            createUser: function (userData) {
                apiUtils.createUser(userData).then(
                    function () {
                        fetchUsers();
                        // TODO: Reset form
                    },
                    function (e) {
                        alert("An unknown error occurred: " + JSON.stringify(e));
                    }
                );
            },

            editUser: function (user) {
                console.log(user);
            },

            deleteUser: function (user) {
                if (confirm("Are you sure you want to delete the user " + user.email + "?")) {
                    apiUtils.deleteUser(user.id).then(
                        function () {
                            fetchUsers();
                        },
                        function (e) {
                            alert("An unknown error occurred: " + JSON.stringify(e));
                        })
                }
            }
        };
    }

    GLOBAL.USERS_ACTIONS_FACTORY = usersActionsFactory;
}(this));
