(function () {
    var Router = ReactRouter;
    var Route = React.createFactory(Router.Route);
    var RouteHandler = React.createFactory(Router.RouteHandler);
    var DefaultRoute = React.createFactory(Router.DefaultRoute);
    var Redirect = React.createFactory(Router.Redirect);

    var CSRF_TOKEN = (function () {
        var token = document.querySelector("meta[name=csrf-token]");
        if (token) return token.getAttribute("content");
        throw new Error("Unable to find CSRF token!");
    }());
    var http = OLYP_HTTP_FACTORY(CSRF_TOKEN)

    var NavbarLinkClass = React.createClass({
        mixins: [Router.Navigation, Router.State],
        propTypes: {
            to: React.PropTypes.string.isRequired
        },

        onClick: function (e) {
            e.preventDefault();
            this.transitionTo(this.props.to, this.props.params, this.props.query);
        },

        render: function () {
            var liClassNames = [];
            if (this.isActive(this.props.to, this.props.params, this.props.query)) {
                liClassNames.push("active");
            }

            return React.DOM.li(
                {className: liClassNames.join(" ")},
                React.DOM.a(
                    {
                        onClick: this.onClick,
                        href: this.makeHref(this.props.to, this.props.params, this.props.query)
                    },
                    this.props.children));
        }
    });
    var NavbarLink = React.createFactory(NavbarLinkClass);

    var GenericIndexHandlerClass = React.createClass({
        render: function () {
            return React.DOM.div(null, RouteHandler(this.props));
        }
    });

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
                            NavbarLink({to: "users"}, "Users"),
                            NavbarLink({to: "customers"}, "Customers"),
                            NavbarLink({to: "hourlyBookings"}, "Hourly bookings"),
                            NavbarLink({to: "monthlyRentals"}, "Monthly rentals")))),
                React.DOM.div(
                    {className: "container-fluid"},
                    RouteHandler(this.props)));
        }
    });

    var UsersIndexHandlerClass = React.createClass({
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
                    customers: stores.customerStore.getAllCustomers()
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
                    customers: stores.customerStore.getAllCustomers()
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

    var CustomersIndexHandlerClass = React.createClass({
        statics: {
            fetchData: function (stores, state) {
                return {
                    customers: stores.customerStore.getAllCustomers()
                };
            }
        },

        render: function () {
            return CUSTOMER_COMPONENTS.CustomerList({
                customers: this.props.fetchedData.customers,
                actions: this.props.actions
            });
        }
    });

    var CustomerNewHandlerClass = React.createClass({
        render: function () {
            return CUSTOMER_COMPONENTS.NewCustomerForm({
                actions: this.props.actions
            });
        }
    });

    var CompanyCustomerEditHandlerClass = React.createClass({
        statics: {
            fetchData: function (stores, state) {
                return {
                    customer: stores.customerStore.getCompanyCustomer(state.params.customerId),
                };
            }
        },

        render: function () {
            return CUSTOMER_COMPONENTS.EditCompanyCustomerForm({
                customer: this.props.fetchedData.customer,
                actions: this.props.actions
            });
        }
    });

    var PersonCustomerEditHandlerClass = React.createClass({
        statics: {
            fetchData: function (stores, state) {
                return {
                    customer: stores.customerStore.getPersonCustomer(state.params.customerId),
                };
            }
        },

        render: function () {
            return CUSTOMER_COMPONENTS.EditPersonCustomerForm({
                customer: this.props.fetchedData.customer,
                actions: this.props.actions
            });
        }
    });

    var MonthlyRentalsIndexHandlerClass = React.createClass({
        statics: {
            fetchData: function (stores, state) {
                return {
                    customersById: stores.customerStore.getAllCustomersById(),
                    usersById: stores.userStore.getAllUsersById(),
                    monthlyRentalRooms: stores.monthlyRentalStore.getAllMonthlyRentalRooms(),
                    monthlyRentalsByRoom: stores.monthlyRentalStore.getMonthlyRentalsByRoom()
                };
            }
        },

        render: function () {
            return MONTHLY_RENTAL_COMPONENTS.MonthlyRentalOverview({
                customersById: this.props.fetchedData.customersById,
                usersById: this.props.fetchedData.usersById,
                monthlyRentalRooms: this.props.fetchedData.monthlyRentalRooms,
                monthlyRentalsByRoom: this.props.fetchedData.monthlyRentalsByRoom,
                totalMonthlyPrice: this.props.stores.monthlyRentalStore.getTotalMonthlyPrice()
            });
        }
    });

    var HourlyBookingsIndexHandlerClass = React.createClass({
        statics: {
            fetchData: function (stores, state) {
                return {
                    recentlyDeletedHourlyBookings: stores.hourlyBookingStore.getRecentlyDeletedHourlyBookings()
                }
            }
        },

        render: function () {
            return HOURLY_BOOKING_COMPONENTS.HourlyBookingsOverview({
                recentlyDeletedHourlyBookings: this.props.fetchedData.recentlyDeletedHourlyBookings
            });
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
                  Redirect({from: "/", to: "users"}),
                  Route({name: "users", path: "/users", handler: GenericIndexHandlerClass},
                        DefaultRoute({name: "usersIndex", handler: UsersIndexHandlerClass}),
                        Route({name: "userNew", path: "/users/new", handler: UserNewHandlerClass}),
                        Route({name: "userEdit", path: "/users/:userId", handler: UserEditHandlerClass}),
                        Route({name: "userChangePassword", path: "/users/:userId/password", handler: UserChangePasswordHandlerClass})),
                  Route({name: "customers", handler: GenericIndexHandlerClass},
                        DefaultRoute({name: "customersIndex", handler: CustomersIndexHandlerClass}),
                        Route({name: "customerNew", path: "/customers/new", handler: CustomerNewHandlerClass}),
                        Route({name: "companyCustomerEdit", path: "/customers/company/:customerId", handler: CompanyCustomerEditHandlerClass}),
                        Route({name: "personCustomerEdit", path: "/customers/person/:customerId", handler: PersonCustomerEditHandlerClass})),
                  Route({name: "hourlyBookings", path: "/hourly_bookings", handler: GenericIndexHandlerClass},
                        DefaultRoute({name: "hourlyBookingsIndex", handler: HourlyBookingsIndexHandlerClass})),
                  Route({name: "monthlyRentals", path: "/monthly_rentals", handler: GenericIndexHandlerClass},
                        DefaultRoute({name: "monthlyRentalsIndex", handler: MonthlyRentalsIndexHandlerClass})))
        ]
    });

    var stores = {
        userStore: USER_STORE.create(http),
        customerStore: CUSTOMER_STORE.create(http),
        passwordStore: PASSWORD_STORE.create(),
        monthlyRentalStore: MONTHLY_RENTAL_STORE.create(http),
        hourlyBookingStore: HOURLY_BOOKING_STORE.create(http)
    };

    var actions = {
        userActions: USER_ACTIONS.create(router, stores.userStore),
        customerActions: CUSTOMER_ACTIONS.create(router, stores.customerStore)
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
                fetchPromises.push(fetchPromise.then(function (resolvedValue) { return {key: key, resolvedValue: resolvedValue}}))
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
                loadingIndicatorEl.style.display = "none";


                if (err instanceof Error) {
                    console.log(err);
                    alert("An unknown error occurred: " + err.message);
                    return;
                }

                alert("An unknown error occurred: " + JSON.stringify(err));
            }
        );
    });
}());
