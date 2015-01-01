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

    var UserFormClass = React.createClass({
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
                    input({type: "text", className: "form-control", valueLink: this.linkState("zipCode")})),
                div({className: "form-group"},
                    label(null, "City"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("city")})),
                div({className: "form-group"},
                    label(null, "Password"),
                    " ",
                    a({className: "btn btn-xs btn-default", onClick: this.generatePassword},
                      "Generate"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("password")})),
                input({type: "submit", value: "Save user", className: "btn btn-primary"}));
        }
    });
    var UserForm = React.createFactory(UserFormClass);

    var UsersAppClass = React.createClass({
        mixin: [FluxRootComponentMixin],

        render: function () {
            return div(
                {className: "row"},
                div({className: "col-md-9"}, "Users list"),
                div({className: "col-md-3"}, UserForm({fluxActions: this.props.fluxActions})));
        }
    });
    var UsersApp = React.createFactory(UsersAppClass);

    GLOBAL.USERS_COMPONENTS = {
        UsersApp: UsersApp
    };
}(this));
