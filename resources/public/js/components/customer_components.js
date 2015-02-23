var CUSTOMER_COMPONENTS = (function () {
    var div = React.DOM.div;
    var label = React.DOM.label;
    var input = React.DOM.input;
    var textarea = React.DOM.textarea;

    var CustomerListItemClass = React.createClass({
        displayName: "CustomerListItem",

        onEditClicked: function () {
            this.props.actions.customerActions.showFormForEditCustomer(this.props.customer);
        },

        getCustomerTypeIcon: function () {
            switch (this.props.customer.type) {
            case "company":
                return React.DOM.span({className: "glyphicon glyphicon-briefcase"});
            case "person":
                return React.DOM.span({className: "glyphicon glyphicon-user"});
            }
        },

        render: function () {
            var customer = this.props.customer;

            return React.DOM.div(
                {className: "row"},
                React.DOM.div({className: "col-md-6"}, customer.name),
                React.DOM.div({className: "col-md-1"}, this.getCustomerTypeIcon()),
                React.DOM.div({className: "col-md-2"}, customer.brreg_id),
                React.DOM.div(
                    {className: "col-md-3"},
                    React.DOM.a({className: "btn btn-default btn-xs", onClick: this.onEditClicked}, "Edit")))
        }
    });
    var CustomerListItem = React.createFactory(CustomerListItemClass);

    var CustomerListClass = React.createClass({
        onCreateCustomer: function () {
            this.props.actions.customerActions.showFormForCreateCustomer();
        },

        render: function () {
            return React.DOM.div(
                {},
                React.DOM.p(
                    null,
                    React.DOM.button({className: "btn btn-default", onClick: this.onCreateCustomer}, "Create customer")),
                this.props.customers.map(function (customer) {
                    return CustomerListItem({
                        key: "customer-" + customer.id,
                        actions: this.props.actions,
                        customer: customer
                    })
                }.bind(this)));
        }
    });
    var CustomerList = React.createFactory(CustomerListClass);

    function getFieldsBasedOnType(type) {
        if (type === "company") {
            return div(
                null,
                div({className: "form-group"},
                    label(null, "Brreg ID"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("brreg_id")})),
                div({className: "form-group"},
                    label(null, "Address"),
                    textarea({type: "text", className: "form-control", valueLink: this.linkState("address")})),
                div({className: "form-group"},
                    label(null, "Zip code"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("zip")})),
                div({className: "form-group"},
                    label(null, "City"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("city")})),
                div({className: "form-group"},
                    label(null, "Room booking free hours"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("room_booking_free_hours")})),
                div({className: "form-group"},
                    label(null, "Room booking hourly price"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("room_booking_hourly_price")})),
                div({className: "form-group"},
                    label(null, "Contact person name"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("contact_person_name")})),
                div({className: "form-group"},
                    label(null, "Contact person e-mail"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("contact_person_email")})),
                div({className: "form-group"},
                    label(null, "Contact person phone"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("contact_person_phone")})));
        }

        if (type === "person") {
            return div(
                null,
                div({className: "form-group"},
                    label(null, "Address"),
                    textarea({type: "text", className: "form-control", valueLink: this.linkState("address")})),
                div({className: "form-group"},
                    label(null, "Zip code"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("zip")})),
                div({className: "form-group"},
                    label(null, "City"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("city")})),
                div({className: "form-group"},
                    label(null, "E-mail"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("contact_person_email")})),
                div({className: "form-group"},
                    label(null, "Phone"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("contact_person_phone")})),
                div({className: "form-group"},
                    label(null, "Room booking free hours"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("room_booking_free_hours")})),
                div({className: "form-group"},
                    label(null, "Room booking hourly price"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("room_booking_hourly_price")})))
        }
    }

    var NewCustomerFormClass = React.createClass({
        mixins: [React.addons.LinkedStateMixin],

        getInitialState: function () {
            return {
                type: "company"
            };
        },

        onTypeChange: function (e) {
            this.setState({type: e.target.value});
        },

        onSubmit: function (e) {
            e.preventDefault();
            if (this.state.type === "company") {
                this.props.actions.customerActions.createCompanyCustomer(this.state);
                return
            }

            if (this.state.type === "person") {
                this.props.actions.customerActions.createPersonCustomer(this.state);
                return
            }
        },

        render: function () {
            return React.DOM.form(
                {onSubmit: this.onSubmit},
                React.DOM.div(
                    null,
                    React.DOM.label(
                        {className: "radio-inline"},
                        React.DOM.input({type: "radio", onChange: this.onTypeChange, checked: this.state.type === "company", value: "company", name: "customerType"}),
                        "Company"),
                    React.DOM.label(
                        {className: "radio-inline"},
                        React.DOM.input({type: "radio", onChange: this.onTypeChange, checked: this.state.type === "person", value: "person", name: "customerType"}),
                        "Person")),
                React.DOM.div(
                    {className: "form-group"},
                    React.DOM.label(null, "Name"),
                    React.DOM.input({type: "text", className: "form-control", valueLink: this.linkState("name")})),
                getFieldsBasedOnType.call(this, this.state.type),
                React.DOM.input({type: "submit", value: "Create customer", className: "btn btn-primary"}));
        }
    });
    var NewCustomerForm = React.createFactory(NewCustomerFormClass);

    var EditCompanyCustomerFormClass = React.createClass({
        mixins: [React.addons.LinkedStateMixin],

        onSubmit: function (e) {
            e.preventDefault()
            this.props.actions.customerActions.updateCompanyCustomer(this.props.customer, this.state);
        },

        onCancelClicked: function () {
            this.props.actions.customerActions.cancelEditCustomer();
        },

        getInitialState: function () {
            var state = {};
            ["name", "brreg_id", "address", "zip", "city", "contact_person_name", "contact_person_email", "contact_person_phone", "version", "room_booking_free_hours", "room_booking_hourly_price"].forEach(function (prop) {
                state[prop] = this.props.customer[prop]
            }.bind(this));

            return state;
        },

        render: function () {
            return React.DOM.form(
                {onSubmit: this.onSubmit},
                React.DOM.div(
                    {className: "form-group"},
                    React.DOM.label(null, "Name"),
                    React.DOM.input({type: "text", className: "form-control", valueLink: this.linkState("name")})),
                getFieldsBasedOnType.call(this, "company"),
                React.DOM.input({type: "submit", value: "Update customer", className: "btn btn-primary"}),
                " ",
                React.DOM.a({className: "btn btn-default", onClick: this.onCancelClicked}, "Cancel"));
        }
    });
    var EditCompanyCustomerForm = React.createFactory(EditCompanyCustomerFormClass);

    var EditPersonCustomerFormClass = React.createClass({
        render: function () {
            return React.DOM.div(null, "Edit person not implemented yet LOLOL");
        }
    });
    var EditPersonCustomerForm = React.createFactory(EditPersonCustomerFormClass);

    return {
        CustomerList: CustomerList,
        NewCustomerForm: NewCustomerForm,
        EditCompanyCustomerForm: EditCompanyCustomerForm,
        EditPersonCustomerForm: EditPersonCustomerForm
    }
}());
