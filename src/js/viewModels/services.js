define([
  "knockout",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "ojs/ojknockout",
  "ojs/ojbutton",
  "ojs/ojdialog",
  "ojs/ojmessages",
  "ojs/ojinputtext",
  "ojs/ojavatar"
], function (ko, ArrayDataProvider) {
  function ServicesViewModel() {
    this.serviceArray = ko.observableArray([]);
    this.messagesDataprovider = ko.observableArray([]);

    this.serviceName = ko.observable();
    this.serviceDesc = ko.observable();

    this.serviceNameUpdate = ko.observable();
    this.serviceDescUpdate = ko.observable();

    this.deletedServiceName = ko.observable();


    callGetService("getServices")
      .then((response) => {
        this.serviceArray(response.servciesTableInputs);
      })
      .catch((error) => {
        console.log(error);
      });

    this.dataprovider = new ArrayDataProvider(this.serviceArray, {
      keyAttributes: "serviceName",
      implicitSort: [{ attribute: "serviceName", direction: "ascending" }],
    });

    open = () => {
      this.serviceName('');
      this.serviceDesc('');
      document.getElementById("createServicesDialog").open();
    };

    openUpdate = () => {
      document.getElementById("updateServicesDialog").open();
    };

    deleteService = () => {
      document.getElementById("deleteServicesDialog").open();
    };


    save = () => {

      if (this.serviceName() && this.serviceDesc()) {
        var input = {
          serviceName: this.serviceName(),
          serviceDescription: this.serviceDesc(),
        };
        callPostServiceReturnString("insertService", input)
          .then((response) => {
            if (response === "N") {
              this.messagesDataprovider.push({
                severity: "error",
                summary: "Error",
                detail: "Error while inserting new service",
                autoTimeout: UTIL.message_timeout,
              });
            } else {
              document.getElementById("createServicesDialog").close();
              callGetService("getServices")
              .then((response) => {
                this.serviceArray(response.servciesTableInputs);
              })
              .catch((error) => {
                console.log(error);
              });

              this.messagesDataprovider.push({
                severity: "confirmation",
                summary: "New service",
                detail: "New service added successfully",
                autoTimeout: UTIL.message_timeout,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.messagesDataprovider.push({
          severity: "error",
          summary: "Missing value",
          detail: "Please enter name and description",
          autoTimeout: UTIL.message_timeout,
        });
      }
    };

    saveUpdate = () => {

      if (this.serviceNameUpdate() && this.serviceDescUpdate()) {

        console.log("her: " + this.serviceDescUpdate() + " " + this.serviceNameUpdate());

        var input = {
          serviceName: this.serviceNameUpdate(),
          serviceDescription: this.serviceDescUpdate(),
        };
        callPostServiceReturnString("updateService", input)
          .then((response) => {
            if (response === "N") {
              this.messagesDataprovider.push({
                severity: "error",
                summary: "Error",
                detail: "Error while updating service",
                autoTimeout: UTIL.message_timeout,
              });
            } else {
              document.getElementById("updateServicesDialog").close();
              callGetService("getServices")
              .then((response) => {
                this.serviceArray(response.servciesTableInputs);
              })
              .catch((error) => {
                console.log(error);
              });

              this.messagesDataprovider.push({
                severity: "confirmation",
                summary: "Update service",
                detail: "Service updated successfully",
                autoTimeout: UTIL.message_timeout,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.messagesDataprovider.push({
          severity: "error",
          summary: "Missing value",
          detail: "Please enter name and description",
          autoTimeout: UTIL.message_timeout,
        });
      }
    };

    okDelete = () => {

      console.log("Delete: " + this.deletedServiceName() );

      var input = {
        serviceName: this.deletedServiceName(),
      };
      callPostServiceReturnString("deleteService", input)
        .then((response) => {
          if (response === "N") {
            this.messagesDataprovider.push({
              severity: "error",
              summary: "Error",
              detail: "Error while deleting service",
              autoTimeout: UTIL.message_timeout,
            });
          } else {
            document.getElementById("deleteServicesDialog").close();
            callGetService("getServices")
            .then((response) => {
              this.serviceArray(response.servciesTableInputs);
            })
            .catch((error) => {
              console.log(error);
            });

            this.messagesDataprovider.push({
              severity: "confirmation",
              summary: "Delete service",
              detail: "Service deleted successfully",
              autoTimeout: UTIL.message_timeout,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };



    cancel = () => {
      document.getElementById("createServicesDialog").close();
    };

    cancelUpdate = () => {
      document.getElementById("updateServicesDialog").close();
    };

    cancelDelete = () => {
      document.getElementById("deleteServicesDialog").close();
    };

    this.selectedChangedListener = (event) => {
        const row = event.detail.value.row;
        if (row.values().size > 0) {
          row.values().forEach( (key) => {
            var selectedRow = this.serviceArray().find(s => s.serviceName === key)

            this.serviceNameUpdate(key);
            this.serviceDescUpdate(selectedRow.serviceDescription);
            this.deletedServiceName(key);
          });
        }
    }
  }
  return ServicesViewModel;
});
