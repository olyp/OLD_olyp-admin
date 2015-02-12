var USER_COMPONENTS = (function () {
    var div = React.DOM.div;
    var form = React.DOM.form;
    var input = React.DOM.input;
    var label = React.DOM.label;
    var a = React.DOM.a;
    var p = React.DOM.p;

    var FluxChildComponentMixin = {
        propTypes: {
            actions: React.PropTypes.object.isRequired
        }
    };

    var UserListItemClass = React.createClass({
        mixins: [FluxChildComponentMixin],
        displayName: "UserListItem",

        onEditUserClicked: function () {
            this.props.actions.userActions.showFormForEditUser(this.props.user);
        },

        onDeleteUserClicked: function () {
            this.props.actions.userActions.deleteUser(this.props.user);
        },

        onChangePasswordClicked: function () {
            this.props.actions.userActions.showFormForChangeUserPassword(this.props.user);
        },

        render: function () {
            var user = this.props.user;

            return div(
                {className: "row"},
                div({className: "col-md-3"}, user.email),
                div({className: "col-md-3"}, user.name),
                div({className: "col-md-1"}, user.zip),
                div({className: "col-md-2"}, user.city),
                div({className: "col-md-3"},
                    a({className: "btn btn-default btn-xs", onClick: this.onEditUserClicked},
                      "Edit"),
                    " ",
                    a({className: "btn btn-default btn-xs", onClick: this.onChangePasswordClicked},
                      "Change password")));
        }
    });
    var UserListItem = React.createFactory(UserListItemClass);

    var UserListClass = React.createClass({
        mixins: [FluxChildComponentMixin],
        displayName: "UserList",

        onCreateUser: function () {
            this.props.actions.userActions.showFormForCreateUser();
        },

        render: function () {
            return div(
                null,
                p(null, a({className: "btn btn-default", onClick: this.onCreateUser}, "Create user")),
                this.props.users.map(function (user) {
                    return UserListItem({key: "user-" + user.id, actions: this.props.actions, user: user});
                }.bind(this)))
        }
    });
    var UserList = React.createFactory(UserListClass);

    var NewUserFormClass = React.createClass({
        mixins: [FluxChildComponentMixin, React.addons.LinkedStateMixin],

        getInitialState: function () {
            return {};
        },

        onSubmit: function (e) {
            e.preventDefault();
            this.props.actions.userActions.createUser(this.state);
        },

        generatePassword: function () {
            this.setState({password: this.props.passwordStore.generateRandomPassword()})
        },

        render: function () {
            return form(
                {onSubmit: this.onSubmit},
                div({className: "form-group"},
                    label(null, "E-mail"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("email")})),
                div({className: "form-group"},
                    label(null, "Name"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("name")})),
                div({className: "form-group"},
                    label(null, "Customer"),
                    React.DOM.select(
                        {className: "form-control", valueLink: this.linkState("customer_id")},
                        React.DOM.option(),
                        this.props.customers.map(function (customer) {
                            return React.DOM.option(
                                {
                                    key: "customer-" + customer.id,
                                    value: customer.id
                                },
                                customer.name);
                        })
                    )),
                div({className: "form-group"},
                    label(null, "Password"),
                    " ",
                    a({className: "btn btn-xs btn-default", onClick: this.generatePassword},
                      "Generate"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("password")})),
                input({type: "submit", value: "Create user", className: "btn btn-primary"}));
        }
    });
    var NewUserForm = React.createFactory(NewUserFormClass);


    var EditUserFormClass = React.createClass({
        mixins: [FluxChildComponentMixin, React.addons.LinkedStateMixin],
        displayName: "EditUserForm",

        propTypes: {
            user: React.PropTypes.object.isRequired,
            customers: React.PropTypes.array.isRequired
        },

        getInitialState: function () {
            return {
                email: this.props.user.email,
                name: this.props.user.name,
                version: this.props.user.version,
                customer_id: this.props.user.customer_id
            };
        },

        onSubmit: function (e) {
            e.preventDefault();
            this.props.actions.userActions.updateUser(this.props.user, this.state);
        },

        onCancel: function () {
            this.props.actions.userActions.cancelEditUser();
        },

        render: function () {
            return form(
                {onSubmit: this.onSubmit},
                div({className: "form-group"},
                    label(null, "E-mail"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("email")})),
                div({className: "form-group"},
                    label(null, "Name"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("name")})),
                div({className: "form-group"},
                    label(null, "Customer"),
                    React.DOM.select(
                        {className: "form-control", valueLink: this.linkState("customer_id")},
                        React.DOM.option(),
                        this.props.customers.map(function (customer) {
                            return React.DOM.option(
                                {
                                    key: "customer-" + customer.id,
                                    value: customer.id
                                },
                                customer.name);
                        })
                    )),
                input({type: "submit", value: "Update user", className: "btn btn-primary"}),
                " ",
                a({className: "btn btn-default", onClick: this.onCancel}, "Cancel"))
        }
    });
    var EditUserForm = React.createFactory(EditUserFormClass);

    var ChangeUserPasswordFormClass = React.createClass({
        mixins: [FluxChildComponentMixin, React.addons.LinkedStateMixin],

        getInitialState: function () {
            return {};
        },

        onSubmit: function (e) {
            e.preventDefault();
            this.props.actions.userActions.changeUserPassword(this.props.user, this.state.password);
        },

        onCancel: function () {
            this.props.actions.userActions.cancelEditUser();
        },

        generatePassword: function () {
            this.setState({password: this.props.passwordStore.generateRandomPassword()})
        },

        render: function () {
            return form(
                {onSubmit: this.onSubmit},
                p(null, "Changing password for user " + this.props.user.email),
                div({className: "form-group"},
                    label(null, "Password"),
                    " ",
                    a({className: "btn btn-xs btn-default", onClick: this.generatePassword},
                      "Generate"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("password")})),
                input({type: "submit", value: "Change password", className: "btn btn-primary"}),
                " ",
                a({className: "btn btn-default", onClick: this.onCancel}, "Cancel"));
        }
    });
    var ChangeUserPasswordForm = React.createFactory(ChangeUserPasswordFormClass);

    return {
        UserList: UserList,
        NewUserForm: NewUserForm,
        EditUserForm: EditUserForm,
        ChangeUserPasswordForm: ChangeUserPasswordForm
    };
}());
