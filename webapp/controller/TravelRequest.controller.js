sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("travelapp.controller.TravelRequest", {

        onInit: function () {
            this.getView().setModel(new JSONModel({
                showTravelClass:   true,
                showAccommodation: false
            }), "viewModel");

            this.getOwnerComponent().getRouter()
                .getRoute("travelRequest")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            var oView = this.getView();
            oView.byId("purposeSelect").setSelectedKey("meeting");
            oView.byId("destinationCityInput").setValue("");
            oView.byId("destinationCountryInput").setValue("");
            oView.byId("departureDatePicker").setValue("");
            oView.byId("departureDatePicker").setValueState("None");
            oView.byId("returnDatePicker").setValue("");
            oView.byId("returnDatePicker").setValueState("None");
            oView.byId("durationInput").setValue("");
            oView.byId("transportSelect").setSelectedKey("flight");
            oView.byId("travelClassSelect").setSelectedKey("economy");
            oView.byId("accommodationSwitch").setState(false);
            oView.byId("hotelInput").setValue("");
            oView.byId("travelCostInput").setValue("");
            oView.byId("accommodationCostInput").setValue("");
            oView.byId("totalCostInput").setValue("");
            oView.byId("currencySelect").setSelectedKey("qar");
            oView.byId("justificationTextArea").setValue("");
            oView.byId("notesTextArea").setValue("");

            oView.getModel("viewModel").setData({
                showTravelClass:   true,
                showAccommodation: false
            });
        },

        onTransportChange: function (oEvent) {
            var sKey = oEvent.getParameter("selectedItem").getKey();
            this.getView().getModel("viewModel")
                .setProperty("/showTravelClass", sKey === "flight" || sKey === "train");
        },

        onAccommodationChange: function (oEvent) {
            var bOn = oEvent.getParameter("state");
            this.getView().getModel("viewModel").setProperty("/showAccommodation", bOn);
            if (!bOn) {
                this.getView().byId("accommodationCostInput").setValue("");
                this._recalcTotal();
            }
        },

        onDateChange: function () {
            var oView  = this.getView();
            var oFrom  = oView.byId("departureDatePicker");
            var oTo    = oView.byId("returnDatePicker");
            var oDur   = oView.byId("durationInput");
            var dFrom  = oFrom.getDateValue();
            var dTo    = oTo.getDateValue();

            if (dFrom && dTo) {
                if (dTo < dFrom) {
                    oTo.setValueState("Error");
                    oTo.setValueStateText("Return date must be on or after departure date.");
                    oDur.setValue("");
                    return;
                }
                oTo.setValueState("None");
                var iNights = Math.round((dTo - dFrom) / (1000 * 60 * 60 * 24));
                oDur.setValue(iNights + (iNights === 1 ? " Night" : " Nights"));
            }
        },

        onCostChange: function () {
            this._recalcTotal();
        },

        _recalcTotal: function () {
            var oView  = this.getView();
            var fTravel = parseFloat(oView.byId("travelCostInput").getValue()) || 0;
            var fAccom  = parseFloat(oView.byId("accommodationCostInput").getValue()) || 0;
            var fTotal  = fTravel + fAccom;
            oView.byId("totalCostInput").setValue(fTotal > 0 ? fTotal.toLocaleString() : "");
        },

        onSubmit: function () {
            var oView = this.getView();
            var oVM   = oView.getModel("viewModel");

            var sCity        = oView.byId("destinationCityInput").getValue().trim();
            var sCountry     = oView.byId("destinationCountryInput").getValue().trim();
            var sDeparture   = oView.byId("departureDatePicker").getValue();
            var sReturn      = oView.byId("returnDatePicker").getValue();
            var sJustify     = oView.byId("justificationTextArea").getValue().trim();

            if (!sCity || !sCountry) {
                MessageBox.warning("Please enter the destination city and country.");
                return;
            }
            if (!sDeparture || !sReturn) {
                MessageBox.warning("Please select both departure and return dates.");
                return;
            }
            if (oView.byId("returnDatePicker").getValueState() === "Error") {
                MessageBox.warning("Please fix the date selection before submitting.");
                return;
            }
            if (!sJustify) {
                MessageBox.warning("Please provide a business justification for this travel.");
                return;
            }

            var bShowClass  = oVM.getProperty("/showTravelClass");
            var bAccom      = oView.byId("accommodationSwitch").getState();
            var sCurrency   = oView.byId("currencySelect").getSelectedItem().getKey().toUpperCase();
            var sTravelCost = oView.byId("travelCostInput").getValue() || "0";
            var sAccomCost  = bAccom ? (oView.byId("accommodationCostInput").getValue() || "0") : "0";
            var sTotal      = oView.byId("totalCostInput").getValue() || "0";
            var sRequestId  = "TR-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 900 + 100);

            this.getOwnerComponent().setModel(new JSONModel({
                requestId:         sRequestId,
                employeeName:      oView.byId("employeeNameInput").getValue(),
                employeeId:        oView.byId("employeeIdInput").getValue(),
                department:        oView.byId("departmentInput").getValue(),
                manager:           oView.byId("managerInput").getValue(),
                purpose:           oView.byId("purposeSelect").getSelectedItem().getText(),
                destination:       sCity + ", " + sCountry,
                departureDate:     sDeparture,
                returnDate:        sReturn,
                duration:          oView.byId("durationInput").getValue() || "Same Day",
                modeOfTransport:   oView.byId("transportSelect").getSelectedItem().getText(),
                travelClass:       bShowClass ? oView.byId("travelClassSelect").getSelectedItem().getText() : "N/A",
                accommodation:     bAccom ? "Yes" : "No",
                hotel:             bAccom ? (oView.byId("hotelInput").getValue() || "No preference") : "Not Required",
                estimatedCost:     sTravelCost + " " + sCurrency,
                accommodationCost: sAccomCost + " " + sCurrency,
                totalCost:         sTotal + " " + sCurrency,
                justification:     sJustify,
                notes:             oView.byId("notesTextArea").getValue() || "—",
                status:            "Pending Approval",
                submittedOn:       new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            }), "confirmation");

            this.getOwnerComponent().getRouter().navTo("confirmation");
        },

        onCancel: function () {
            this.getOwnerComponent().getRouter().navTo("dashboard");
        }

    });
});
