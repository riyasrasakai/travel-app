sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("travelapp.controller.Dashboard", {

        onInit: function () {
            var oModel = new JSONModel({
                employeeName: "John Doe",
                employeeId:   "EMP001",
                department:   "Engineering",
                designation:  "Senior Developer",
                initials:     "JD",
                manager:      "Mohammed Al-Qahtani",
                summary: {
                    total:    12,
                    pending:   3,
                    approved:  8,
                    rejected:  1
                },
                requests: [
                    {
                        requestId:   "TR-2026-089",
                        destination: "Dubai, UAE",
                        purpose:     "Business Meeting",
                        travelDates: "15 Mar – 17 Mar 2026",
                        status:      "Approved",
                        statusState: "Success"
                    },
                    {
                        requestId:   "TR-2026-074",
                        destination: "London, UK",
                        purpose:     "Conference",
                        travelDates: "20 Feb – 25 Feb 2026",
                        status:      "Approved",
                        statusState: "Success"
                    },
                    {
                        requestId:   "TR-2026-061",
                        destination: "Riyadh, KSA",
                        purpose:     "Client Visit",
                        travelDates: "10 Jan – 12 Jan 2026",
                        status:      "Pending",
                        statusState: "Warning"
                    },
                    {
                        requestId:   "TR-2025-112",
                        destination: "New York, USA",
                        purpose:     "Training",
                        travelDates: "05 Dec – 12 Dec 2025",
                        status:      "Rejected",
                        statusState: "Error"
                    }
                ]
            });

            this.getView().setModel(oModel, "dashboard");
        },

        onNewRequest: function () {
            this.getOwnerComponent().getRouter().navTo("travelRequest");
        }

    });
});
