(function () {
    var Router = ReactRouter;
    var Route = React.createFactory(Router.Route);
    var RouteHandler = React.createFactory(Router.RouteHandler);
    var DefaultRoute = React.createFactory(Router.DefaultRoute);
    var Link = React.createFactory(Router.Link);

    var CSRF_TOKEN = (function () {
        var token = document.querySelector("meta[name=csrf-token]");
        if (token) return token.getAttribute("content");
        throw new Error("Unable to find CSRF token!");
    }());
    var http = OLYP_HTTP_FACTORY(CSRF_TOKEN)

    var IndexHandlerClass = React.createClass({
        render: function () {
            return React.DOM.div(
                null,
                React.DOM.div(
                    {className: "navbar navbar-default"},
                    React.DOM.div(
                        {className: "container-fluid"},
                        React.DOM.div(
                            {className: "navbar-header"},
                            React.DOM.span({className: "navbar-brand"}, "Olyp Admin")),
                        React.DOM.ul(
                            {className: "nav navbar-nav"},
                            React.DOM.li(null, Link({to: "users"}, "Users")),
                            React.DOM.li(null, Link({to: "customers"}, "Customers"))))),
                React.DOM.div(
                    {className: "container-fluid"},
                    RouteHandler(this.props)));
        }
    });

    var UsersHandlerClass = React.createClass({
        statics: {
            fetchData: function (stores, state) {
                return {
                    users: stores.userStore.getAllUsers()
                };
            }
        },

        render: function () {
            return USER_COMPONENTS.UserList({
                users: this.props.fetchedData.users,
                actions: this.props.actions
            });
        }
    });

    var UserNewHandlerClass = React.createClass({
        statics: {
            fetchData: function (stores, state) {
                return {
                    customers: stores.customersStore.getAllCustomers()
                };
            }
        },

        render: function () {
            return USER_COMPONENTS.NewUserForm({
                customers: this.props.fetchedData.customers,
                passwordStore: this.props.stores.passwordStore,
                actions: this.props.actions
            });
        }
    });

    var UserEditHandlerClass = React.createClass({
        statics: {
            fetchData: function (stores, state) {
                return {
                    user: stores.userStore.getUser(state.params.userId),
                    customers: stores.customersStore.getAllCustomers()
                };
            }
        },

        render: function () {
            return USER_COMPONENTS.EditUserForm({
                user: this.props.fetchedData.user,
                customers: this.props.fetchedData.customers,
                actions: this.props.actions
            });
        }
    });

    var UserChangePasswordHandlerClass = React.createClass({
        statics: {
            fetchData: function (stores, state) {
                return {
                    user: stores.userStore.getUser(state.params.userId)
                };
            }
        },

        render: function () {
            return USER_COMPONENTS.ChangeUserPasswordForm({
                user: this.props.fetchedData.user,
                actions: this.props.actions,
                passwordStore: this.props.stores.passwordStore
            });
        }
    });

    var CustomersHandlerClass = React.createClass({
        render: function () {
            return React.DOM.div(null, "Customers page!");
        }
    });



    var target = document.getElementById("olyp-admin-app");
    var loadingIndicatorEl = document.createElement("div");
    loadingIndicatorEl.style.display = "none";
    loadingIndicatorEl.style.position = "fixed";
    loadingIndicatorEl.style.top = "0px";
    loadingIndicatorEl.style.left = "50%";
    loadingIndicatorEl.style.width = "150px";
    loadingIndicatorEl.style.marginLeft = "-75px";
    loadingIndicatorEl.style.backgroundColor = "yellow";
    loadingIndicatorEl.style.border = "1px solid orange";
    loadingIndicatorEl.style.borderTop = "none";
    loadingIndicatorEl.style.padding = "10px";
    loadingIndicatorEl.style.textAlign = "center";
    loadingIndicatorEl.style.fontWeight = "bold";
    loadingIndicatorEl.textContent = "Loading...";
    document.body.appendChild(loadingIndicatorEl);

    var router = Router.create({
        routes: [
            Route({name: "index", path: "/", handler: IndexHandlerClass},
                  Route({name: "customers", handler: CustomersHandlerClass}),
                  Route({name: "userNew", path: "/users/new", handler: UserNewHandlerClass}),
                  Route({name: "userEdit", path: "/users/:userId", handler: UserEditHandlerClass}),
                  Route({name: "userChangePassword", path: "/users/:userId/password", handler: UserChangePasswordHandlerClass}),
                  DefaultRoute({name: "users", handler: UsersHandlerClass}))
        ]
    });

    var stores = {
        userStore: USER_STORE.create(http),
        customersStore: CUSTOMER_STORE.create(http),
        passwordStore: PASSWORD_STORE.create()
    };

    var actions = {
        userActions: USER_ACTIONS.create(router, stores.userStore)
    };

    router.run(function (Handler, state) {
        loadingIndicatorEl.style.display = "block";
        var toFetch = state.routes
            .filter(function (route) { return route.handler.fetchData; })
            .map(function (route) { return route.handler.fetchData(stores, state); })
            .reduce(function (res, curr) {
                for (var key in curr) {
                    if (res.hasOwnProperty(key)) {
                        throw new Error("Fetcher with key " + key + " added by " + curr.name + " already exists.");
                    } else {
                        res[key] = curr[key];
                    }
                }
                return res
            }, {});

        var fetchPromises = [];
        for (var key in toFetch) {
            (function (key) {
                var fetchPromise = toFetch[key];
                var deferred = when.defer();
                fetchPromise.then(function (resolvedValue) { deferred.resolve({key: key, resolvedValue: resolvedValue}); })
                fetchPromises.push(deferred.promise);
            }(key));
        }

        when.all(fetchPromises).then(
            function (results) {
                var fetchedData = results.reduce(function (res, curr) {
                    res[curr.key] = curr.resolvedValue;
                    return res;
                }, {});

                React.render(React.createFactory(Handler)({
                    stores: stores,
                    actions: actions,
                    fetchedData: fetchedData
                }), target);

                loadingIndicatorEl.style.display = "none";
            },
            function (err) {
                alert("An unknown error occurred: " + err);
                loadingIndicatorEl.style.display = "none";
            }
        );
    });
}());
