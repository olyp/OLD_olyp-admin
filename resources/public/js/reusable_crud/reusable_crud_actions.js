(function (GLOBAL) {
    function reusableCrudActionsFactory(crudFluxStore, apiUtils) {
        function fetchItems() {
            apiUtils.getAllItems().then(
                function (res) {
                    crudFluxStore.setItems(res);
                },
                function (e) {
                    alert("An unknown error occurred: " + JSON.stringify(e));
                }
            );
        }

        fetchItems();

        return {
            newFormSubmitted: function (data) {
                apiUtils.createItem(data).then(
                    function () {
                        fetchItems();
                    } ,
                    function (e) {
                        alert("An unknown error occurred: " + JSON.stringify(e));
                    }
                );
            },

            editFormSubmitted: function (itemId, data) {
                apiUtils.updateItem(itemId, data).then(
                    function () {
                        crudFluxStore.setForm({type: "new"});
                        fetchItems();
                    },
                    function (e) {
                        alert("An unknown error occurred: " + JSON.stringify(e));
                    }
                );
            },

            editItem: function (item) {
                crudFluxStore.setForm({type: "edit", item: item, itemId: item.id});
            },

            cancelForm: function () {
                crudFluxStore.setForm({type: "new"});
            }
        }
    }

    GLOBAL.REUSABLE_CRUD_ACTIONS_FACTORY = reusableCrudActionsFactory;
}(this));
