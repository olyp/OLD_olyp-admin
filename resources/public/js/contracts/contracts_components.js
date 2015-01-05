(function (GLOBAL) {
    var div = React.DOM.div;
    var a = React.DOM.a;
    var label = React.DOM.label;
    var input = React.DOM.input;
    var textarea = React.DOM.textarea;
    var form = React.DOM.form;

    var CreateContractFormClass = React.createClass({
        mixins: [React.addons.LinkedStateMixin, REUSABLE_CRUD_COMPONENTS.CrudNewFormLinkedStateMixin],

        render: function () {
            return form(
                {onSubmit: this.onSubmit},
                div({className: "form-group"},
                    label(null, "Name"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("name")})),
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
                input({type: "submit", value: "Create contract", className: "btn btn-primary"}))
        }
    });
    var CreateContractForm = React.createFactory(CreateContractFormClass);

    var EditContractFormClass = React.createClass({
        mixins: [React.addons.LinkedStateMixin, REUSABLE_CRUD_COMPONENTS.CrudEditFormLinkedStateMixin],

        onCancelClicked: function () {
            this.crudEditCancel();
        },

        render: function () {
            return form(
                {onSubmit: this.onSubmit},
                div({className: "form-group"},
                    label(null, "Name"),
                    input({type: "text", className: "form-control", valueLink: this.linkState("name")})),
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

        render: function () {
            var contract = this.props.crudListItem;

            return div(
                {className: "row"},
                div({className: "col-md-2"}, contract.name),
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
