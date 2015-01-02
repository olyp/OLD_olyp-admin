(function (GLOBAL) {
    var div = React.DOM.div;
    var form = React.DOM.form;
    var input = React.DOM.input;
    var label = React.DOM.label;
    var a = React.DOM.a;

    var FluxRootComponentMixin = {
        propTypes: {
            fluxActions: React.PropTypes.object.required,
            fluxStore: React.PropTypes.object.required
        }
    };

    var FluxChildComponentMixin = {
        propTypes: {
            // fluxActions: React.PropTypes.object.required
        }
    };

    var UserListItemClass = React.createClass({
        mixins: [FluxChildComponentMixin],

        onEditUserClicked: function () {
            this.props.fluxActions.editUser(this.props.user);
        },

        onDeleteUserClicked: function () {
            this.props.fluxActions.deleteUser(this.props.user);
        },

        onChangePasswordClicked: function () {
            this.props.fluxActions.changeUserPassword(this.props.user);
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
                    a({className: "btn btn-default btn-xs", onClick: this.onDeleteUserClicked},
                      "Delete"),
                    " ",
                    a({className: "btn btn-default btn-xs", onClick: this.onChangePasswordClicked},
                      "Change password")));
        }
    });
    var UserListItem = React.createFactory(UserListItemClass);

    var UserListClass = React.createClass({
        mixins: [FluxChildComponentMixin],

        render: function () {
            return div(
                null,
                this.props.users.map(function (user) {
                    return UserListItem({key: "user-" + user.id, fluxActions: this.props.fluxActions, user: user});
                }.bind(this)))
        }
    });
    var UserList = React.createFactory(UserListClass);

    var CreateUserFormClass = React.createClass({
        mixins: [FluxChildComponentMixin, React.addons.LinkedStateMixin],

        getInitialState: function () {
            return {};
        },

        onSubmit: function (e) {
            e.preventDefault();
            this.props.fluxActions.createUser(this.state);
        },

        generatePassword: function () {
            this.setState({password: this.props.fluxActions.generateRandomPassword()})
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
                    label(null, "Zip code"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("zip")})),
                div({className: "form-group"},
                    label(null, "City"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("city")})),
                div({className: "form-group"},
                    label(null, "Password"),
                    " ",
                    a({className: "btn btn-xs btn-default", onClick: this.generatePassword},
                      "Generate"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("password")})),
                input({type: "submit", value: "Create user", className: "btn btn-primary"}));
        }
    });
    var CreateUserForm = React.createFactory(CreateUserFormClass);


    var EditUserFormClass = React.createClass({
        mixins: [FluxChildComponentMixin, React.addons.LinkedStateMixin],

        getInitialState: function () {
            return {
                email: this.props.user.email,
                name: this.props.user.name,
                zip: this.props.user.zip,
                city: this.props.user.city,
                version: this.props.user.version
            };
        },

        onSubmit: function (e) {
            e.preventDefault();
            this.props.fluxActions.updateUser(this.props.user, this.state);
        },

        onCancel: function () {
            this.props.fluxActions.cancelEditUser();
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
                    label(null, "Zip code"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("zip")})),
                div({className: "form-group"},
                    label(null, "City"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("city")})),
                input({type: "submit", value: "Update user", className: "btn btn-primary"}),
                " ",
                a({className: "btn btn-default", onClick: this.onCancel}, "Cancel"))
        }
    });
    var EditUserForm = React.createFactory(EditUserFormClass);

    var UsersAppClass = React.createClass({
        mixin: [FluxRootComponentMixin],

        getUserFormComponent: function () {
            switch (this.props.fluxStore.getCurrentUserForm()) {
            case "new":
                return CreateUserForm({fluxActions: this.props.fluxActions});
            case "edit":
                return EditUserForm({fluxActions: this.props.fluxActions, user: this.props.fluxStore.getUserToEdit()});
            case "changePassword":
                return div(null, "change password!");
            }
        },

        render: function () {
            return div(
                {className: "row"},
                div({className: "col-md-9"}, UserList({fluxActions: this.props.fluxActions, users: this.props.fluxStore.getUsers()})),
                div({className: "col-md-3"}, this.getUserFormComponent()));
        }
    });
    var UsersApp = React.createFactory(UsersAppClass);

    GLOBAL.USERS_COMPONENTS = {
        UsersApp: UsersApp
    };
}(this));
