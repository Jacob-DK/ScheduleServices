define([
  "knockout",
  "ojs/ojpagingdataproviderview",
  "ojs/ojarraydataprovider",
  "ojs/ojknockout",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojbutton",
  "ojs/ojdialog",
  "ojs/ojmessages",
  "ojs/ojinputtext",
  "ojs/ojavatar",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset"  
], function (
  ko,
  PagingDataProviderView,
  ArrayDataProvider
) {
  function UsersViewModel() {
    this.usersArray = ko.observableArray([]);
    this.messagesDataprovider = ko.observableArray([]);

    this.userName = ko.observable();
    this.userPassword = ko.observable();
    this.userDisplayName = ko.observable();
    this.userType = ko.observable('USER');
    this.userActive = ko.observableArray([]);

    this.userNameUpdate = ko.observable();

    this.deletedUserName = ko.observable();    

    callGetService("getUsers")
      .then((response) => {
        this.usersArray(response.userTableInputs);
      })
      .catch((error) => {
        console.log(error);
      });

    // this.dataprovider = new ArrayDataProvider(this.serviceArray, {
    //   keyAttributes: "user_name",
    //   implicitSort: [{ attribute: "user_name", direction: "ascending" }],
    // });

    this.pagingDataProvider = new PagingDataProviderView(
      new ArrayDataProvider(this.usersArray, { idAttribute: "userName" })
    );

    open = () => {
      this.userName('');
      this.userPassword('');
      this.userDisplayName('');
      this.userType('USER');
      document.getElementById("createUserDialog").open();
    };

    openUpdate = () => {
      document.getElementById("updateUserDialog").open();
    };

    deleteUser = () => {
      document.getElementById("deleteUserDialog").open();
    };


    save = () => {

      if (this.userName() && this.userPassword() && this.userDisplayName() ) {
        var input = {
          userName: this.userName(),
          userPassword: this.userPassword(),
          userDisplayName: this.userDisplayName(),
          userActive: this.userActive(),
          userType: this.userType(),
        };
        callPostServiceReturnString("insertUser", input)
          .then((response) => {
            if (response === "N") {
              this.messagesDataprovider.push({
                severity: "error",
                summary: "Error",
                detail: "Error while inserting new user",
                autoTimeout: UTIL.message_timeout,
              });
            } else {
              document.getElementById("createUserDialog").close();
              callGetService("getUsers")
              .then((response) => {
                this.usersArray(response.userTableInputs);
              })
              .catch((error) => {
                console.log(error);
              });

              this.messagesDataprovider.push({
                severity: "confirmation",
                summary: "New user",
                detail: "New user added successfully",
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
          detail: "Please enter user information",
          autoTimeout: UTIL.message_timeout,
        });
      }
    };

    saveUpdate = () => {

      if (this.userName() && this.userPassword() && this.userDisplayName()) {

        var input = {
          userName: this.userName(),
          userPassword: this.userPassword(),
          userDisplayName: this.userDisplayName(),
          userActive: this.userActive(),
          userType: this.userType(),
        };
        callPostServiceReturnString("updateUser", input)
          .then((response) => {
            if (response === "N") {
              this.messagesDataprovider.push({
                severity: "error",
                summary: "Error",
                detail: "Error while updating user",
                autoTimeout: UTIL.message_timeout,
              });
            } else {
              document.getElementById("updateUserDialog").close();
              callGetService("getUsers")
              .then((response) => {
                this.usersArray(response.userTableInputs);
              })
              .catch((error) => {
                console.log(error);
              });

              this.messagesDataprovider.push({
                severity: "confirmation",
                summary: "Update user",
                detail: "User updated successfully",
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

      console.log("Delete: " + this.deletedUserName() );

      var input = {
        userName: this.deletedUserName(),
      };
      callPostServiceReturnString("deleteUser", input)
        .then((response) => {
          if (response === "N") {
            this.messagesDataprovider.push({
              severity: "error",
              summary: "Error",
              detail: "Error while deleting user",
              autoTimeout: UTIL.message_timeout,
            });
          } else {
            document.getElementById("deleteUserDialog").close();
            callGetService("getUsers")
            .then((response) => {
              this.usersArray(response.userTableInputs);
            })
            .catch((error) => {
              console.log(error);
            });

            this.messagesDataprovider.push({
              severity: "confirmation",
              summary: "Delete user",
              detail: "User deleted successfully",
              autoTimeout: UTIL.message_timeout,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };



    cancel = () => {
      document.getElementById("createUserDialog").close();
    };

    cancelUpdate = () => {
      document.getElementById("updateUserDialog").close();
    };

    cancelDelete = () => {
      document.getElementById("deleteUserDialog").close();
    };

    this.selectedChangedListener = (event) => {
        const row = event.detail.value.row;
        if (row.values().size > 0) {
          row.values().forEach( (key) => {
            var selectedRow = this.usersArray().find(s => s.userName === key)

            this.userName(key);
            this.userDisplayName(selectedRow.userDisplayName);
            this.userType(selectedRow.userType);
            this.userPassword(selectedRow.userPassword);
            this.deletedUserName(key);

          });
        }
    }    
  }
  return UsersViewModel;
});
