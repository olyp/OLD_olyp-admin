var CUSTOMER_COMPONENTS = (function () {
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
        render: function () {
            return React.DOM.div(
                {},
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

    var NewCustomerFormClass = React.createClass({
        render: function () {
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
                React.DOM.div(
                    {className: "form-group"},
                    React.DOM.label(null, "Brreg ID"),
                    React.DOM.input({type: "text", className: "form-control", valueLink: this.linkState("brreg_id")})),
                React.DOM.div(
                    {className: "form-group"},
                    React.DOM.label(null, "Address"),
                    React.DOM.textarea({type: "text", className: "form-control", valueLink: this.linkState("address")})),
                React.DOM.div(
                    {className: "form-group"},
                    React.DOM.label(null, "Zip code"),
                    React.DOM.input({type: "text", className: "form-control", valueLink: this.linkState("zip")})),
                React.DOM.div(
                    {className: "form-group"},
                    React.DOM.label(null, "City"),
                    React.DOM.input({type: "text", className: "form-control", valueLink: this.linkState("city")})),
                React.DOM.div(
                    {className: "form-group"},
                    React.DOM.label(null, "Room booking free hours"),
                    React.DOM.input({type: "text", className: "form-control", valueLink: this.linkState("room_booking_free_hours")})),
                React.DOM.div(
                    {className: "form-group"},
                    React.DOM.label(null, "Room booking hourly price"),
                    React.DOM.input({type: "text", className: "form-control", valueLink: this.linkState("room_booking_hourly_price")})),
                React.DOM.div(
                    {className: "form-group"},
                    React.DOM.label(null, "Contact person name"),
                    React.DOM.input({type: "text", className: "form-control", valueLink: this.linkState("contact_person_name")})),
                React.DOM.div(
                    {className: "form-group"},
                    React.DOM.label(null, "Contact person e-mail"),
                    React.DOM.input({type: "text", className: "form-control", valueLink: this.linkState("contact_person_email")})),
                React.DOM.div(
                    {className: "form-group"},
                    React.DOM.label(null, "Contact person phone"),
                    React.DOM.input({type: "text", className: "form-control", valueLink: this.linkState("contact_person_phone")})),
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
