sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("travelapp.controller.Confirmation", {

        onInit: function () {
            this.getOwnerComponent().getRouter()
                .getRoute("confirmation")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            // Confirmation model is set on the component by TravelRequest controller
        },

        onBackToDashboard: function () {
            this.getOwnerComponent().getRouter().navTo("dashboard");
        }

    });
});
