(function (GLOBAL) {
    var div = React.DOM.div;
    var a = React.DOM.a;
    var label = React.DOM.label;
    var input = React.DOM.input;
    var textarea = React.DOM.textarea;
    var form = React.DOM.form;
    var span = React.DOM.span;

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
                    input({type: "text", className: "form-control", valueLink: this.linkState("contact_person_phone")})))
        }
    }


    var CreateContractFormClass = React.createClass({
        mixins: [React.addons.LinkedStateMixin, REUSABLE_CRUD_COMPONENTS.CrudNewFormLinkedStateMixin],

        getInitialState: function () {
            return {
                type: "company"
            };
        },

        onTypeChange: function (e) {
            this.setState({type: e.target.value});
        },

        render: function () {
            return form(
                {onSubmit: this.onSubmit},
                div(null,
                    label({className: "radio-inline"},
                          input({type: "radio", onChange: this.onTypeChange, checked: this.state.type === "company", value: "company", name: "contractType"}),
                          "Company"),
                    label({className: "radio-inline"},
                          input({type: "radio", onChange: this.onTypeChange, checked: this.state.type === "person", value: "person", name: "contractType"}),
                          "Person")),
                div({className: "form-group"},
                    label(null, "Name"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("name")})),
                getFieldsBasedOnType.call(this, this.state.type),
                input({type: "submit", value: "Create contract", className: "btn btn-primary"}))
        }
    });
    var CreateContractForm = React.createFactory(CreateContractFormClass);

    var EditContractFormClass = React.createClass({
        mixins: [React.addons.LinkedStateMixin, REUSABLE_CRUD_COMPONENTS.CrudEditFormLinkedStateMixin],

        getInitialState: function () {
            var contract = this.props.crudItem;
            var fields = [];

            if (contract.type === "company") {
                fields = ["name", "brreg_id", "address", "zip", "city", "contact_person_name", "contact_person_email", "contact_person_phone"];
            }

            if (contract.type === "person") {
                fields = ["name", "address", "zip", "city", "contact_person_email", "contact_person_phone"];
            }

            var state = {};
            state.type = contract.type;
            state.version = contract.version;

            fields.forEach(function (field) {
                state[field] = contract[field];
            });

            return state;
        },

        onCancelClicked: function () {
            this.crudEditCancel();
        },

        render: function () {
            return form(
                {onSubmit: this.onSubmit},
                div({className: "form-group"},
                    label(null, "Name"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("name")})),
                getFieldsBasedOnType.call(this, this.state.type),
                input({type: "submit", value: "Update contract", className: "btn btn-primary"}),
                " ",
                a({className: "btn btn-default", onClick: this.onCancelClicked}, "Cancel"))
        }
    });
    var EditContractForm = React.createFactory(EditContractFormClass);



    var ContractListItemClass = React.createClass({
        displayName: "ContractListItem",
        mixins: [REUSABLE_CRUD_COMPONENTS.CrudListItemMixin],

        onEditClicked: function () {
            this.crudListItemEdit();
        },

        getContractTypeIcon: function () {
            switch (this.props.crudListItem.type) {
            case "company":
                return span({className: "glyphicon glyphicon-briefcase"});
            case "person":
                return span({className: "glyphicon glyphicon-user"});
            }
        },

        render: function () {
            var contract = this.props.crudListItem;

            return div(
                {className: "row"},
                div({className: "col-md-2"}, contract.name),
                div({className: "col-md-1"}, this.getContractTypeIcon()),
                div({className: "col-md-2"}, contract.brreg_id),
                div({className: "col-md-3"},
                    a({className: "btn btn-default btn-xs", onClick: this.onEditClicked}, "Edit")))
        }
    });
    var ContractListItem = React.createFactory(ContractListItemClass);

    var ContractsAppClass = React.createClass({
        mixins: [REUSABLE_CRUD_COMPONENTS.CrudRootComponentMixin],

        render: function () {
            return div(
                {className: "row"},
                div({className: "col-md-9"}, REUSABLE_CRUD_COMPONENTS.CrudList({
                    rowComponent: ContractListItem,
                    crudFluxStore: this.props.crudFluxStore,
                    crudFluxActions: this.props.crudFluxActions
                })),
                div({className: "col-md-3"}, REUSABLE_CRUD_COMPONENTS.CrudForm({
                    newForm: CreateContractForm,
                    editForm: EditContractForm,
                    crudFluxStore: this.props.crudFluxStore,
                    crudFluxActions: this.props.crudFluxActions
                })));
        }
    });
    var ContractsApp = React.createFactory(ContractsAppClass);

    GLOBAL.CONTRACTS_COMPONENTS = {
        ContractsApp: ContractsApp
    };
}(this));
