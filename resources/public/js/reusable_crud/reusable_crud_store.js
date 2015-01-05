(function (GLOBAL) {
    function reusableCrudStoreFactory() {
        var form = {type: "new"};
        var componentInst;
        var items = [];

        return {
            setComponentInst: function (inst) {
                componentInst = inst;
            },

            getItems: function () {
                return items;
            },

            setItems: function (newItems) {
                items = newItems;
                componentInst.forceUpdate();
            },

            setForm: function (newForm) {
                form = newForm;
                componentInst.forceUpdate();
            },

            getForm: function () {
                return form;
            }
        }
    }

    GLOBAL.REUSABLE_CRUD_STORE_FACTORY = reusableCrudStoreFactory;
}(this));
