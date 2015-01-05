(function (GLOBAL) {
    var div = React.DOM.div;

    var CrudRootComponentMixin = {
        propTypes: {
            crudFluxActions: React.PropTypes.object.isRequired,
            crudFluxStore: React.PropTypes.object.isRequired,
        }
    };

    var CrudListItemMixin = {
        propTypes: {
            crudFluxActions: React.PropTypes.object.isRequired,
            crudListItem: React.PropTypes.any.isRequired
        },
        crudListItemEdit: function () {
            this.props.crudFluxActions.editItem(this.props.crudListItem);
        }
    };

    var CrudNewFormLinkedStateMixin = {
        propTypes: {
            crudFluxActions: React.PropTypes.object.isRequired,
        },

        getInitialState: function () {
            return {};
        },

        onSubmit: function (e) {
            e.preventDefault();
            this.props.crudFluxActions.newFormSubmitted(this.state);
        }
    }

    var CrudEditFormLinkedStateMixin = {
        propTypes: {
            crudFluxActions: React.PropTypes.object.isRequired,
            crudItem: React.PropTypes.object.isRequired,
            crudItemId: React.PropTypes.any.isRequired
        },

        getInitialState: function () {
            var state = {};

            for (var key in this.props.crudItem) {
                if (key === "id") continue;
                state[key] = this.props.crudItem[key];
            }

            return state;
        },

        onSubmit: function (e) {
            e.preventDefault();
            this.props.crudFluxActions.editFormSubmitted(this.props.crudItemId, this.state);
        },

        crudEditCancel: function () {
            this.props.crudFluxActions.cancelForm();
        }
    }

    var CrudListClass = React.createClass({
        displayName: "CrudList",
        propTypes: {
            rowComponent: React.PropTypes.func.isRequired,
            crudFluxActions: React.PropTypes.object.isRequired,
            crudFluxStore: React.PropTypes.object.isRequired,
        },

        render: function () {
            return div(
                null,
                this.props.crudFluxStore.getItems().map(function (item) {
                    return this.props.rowComponent({
                        key: "list-item-" + item.id,
                        crudListItem: item,
                        crudFluxActions: this.props.crudFluxActions
                    })
                }.bind(this)));
        }
    });
    var CrudList = React.createFactory(CrudListClass);

    var CrudFormClass = React.createClass({
        displayName: "CrudForm",
        propTypes: {
            newForm: React.PropTypes.func.isRequired,
            editForm: React.PropTypes.func.isRequired,
            crudFluxActions: React.PropTypes.object.isRequired,
            crudFluxStore: React.PropTypes.object.isRequired
        },

        render: function () {
            var form = this.props.crudFluxStore.getForm();

            switch (form.type) {
            case "new":
                return this.props.newForm({
                    crudFluxActions: this.props.crudFluxActions
                });
            case "edit":
                return this.props.editForm({
                    crudFluxActions: this.props.crudFluxActions,
                    crudItem: form.item,
                    crudItemId: form.itemId
                });
            default:
                return div(null, "unknown form");
            }
            return div(null, "form!");
        }
    });
    var CrudForm = React.createFactory(CrudFormClass);

    GLOBAL.REUSABLE_CRUD_COMPONENTS = {
        CrudList: CrudList,
        CrudForm: CrudForm,
        CrudRootComponentMixin: CrudRootComponentMixin,
        CrudListItemMixin: CrudListItemMixin,
        CrudNewFormLinkedStateMixin: CrudNewFormLinkedStateMixin,
        CrudEditFormLinkedStateMixin: CrudEditFormLinkedStateMixin
    };
}(this));
