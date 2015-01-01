(function () {
    var apiUtils = {};

    var fluxStore = USERS_STORE_FACTORY();
    var fluxActions = USERS_ACTIONS_FACTORY(fluxStore, apiUtils);

    var usersAppInst = React.render(
        USERS_COMPONENTS.UsersApp({
            fluxActions: fluxActions,
            fluxStore: fluxStore
        }),
        document.getElementById("users-app"));

    fluxStore.setUsersAppInst(usersAppInst);
}());
