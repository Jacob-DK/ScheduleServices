define(["knockout", "ojs/ojarraydataprovider", "ojs/ojarraydataprovider", "ojs/ojlistdataproviderview", "ojs/ojasyncvalidator-regexp", "ojs/ojknockout", "ojs/ojtable", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojdialog", "ojs/ojmessages", "ojs/ojavatar"],
 function(ko, ArrayDataProvider, ListDataProviderView) {
    function CustomerViewModel() {
      console.clear();

      this.filter = ko.observable();
      this.customersArray = ko.observableArray([]);
      this.messagesDataprovider = ko.observableArray([]);

      this.customerAddress = ko.observable();
      this.customerDescription = ko.observable();
      this.customerEmail = ko.observable();
      this.customerName = ko.observable();
      this.customerPhone = ko.observable();
      this.customerWebsite = ko.observable();

      console.log("response 0");

      callGetService("getCustomers")
      .then((response) => {
        console.log("response 1");
        console.log("response", response.customersTableInputs);
        this.customersArray(response.customersTableInputs);
        console.log("array", this.customersArray());
      })
      .catch((error) => {
          console.log("err", error);
      });

      this.dataprovider = ko.computed( () => {
          const filterRegEx = new RegExp(this.filter(), "i");
          const filterCriterions = {
              op: "$or",
              criteria: [
                  { op: "$regex", value: { customerId: filterRegEx } },
                  { op: "$regex", value: { customerName: filterRegEx } },
                  { op: "$regex", value: { customerDescription: filterRegEx } },
                  { op: "$regex", value: { customerAddress: filterRegEx } },
                  { op: "$regex", value: { customerEmail: filterRegEx } },
                  { op: "$regex", value: { customerPhone: filterRegEx } },
                  { op: "$regex", value: { customerWebsite: filterRegEx } },
              ],
          };
          console.log("array 2", this.customersArray());

          const arrayDataProvider = new ArrayDataProvider(this.customersArray, { keyAttributes: "customerId" });
          return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterions });
      }, this);
      this.handleValueChanged = () => {
          this.filter(document.getElementById("filter").rawValue);
      };
      this.highlightingCellRenderer = (context) => {
          let field = null;
          if (context.columnIndex === 1) {
              field = "customerId";
          }
          else if (context.columnIndex === 2) {
              field = "customerName";
          }
          else if (context.columnIndex === 3) {
              field = "customerDescription";
          }
          else if (context.columnIndex === 4) {
              field = "customerAddress";
          }
          else if (context.columnIndex === 5) {
            field = "customerEmail";
          }
          else if (context.columnIndex === 6) {
              field = "customerPhone";
          }
          else if (context.columnIndex === 7) {
            field = "customerWebsite";
          }

          let data = context.row[field].toString();
          const filterString = this.filter();
          let textNode;
          let spanNode = document.createElement("span");
          if (filterString && filterString.length > 0) {
              const index = data.toLowerCase().indexOf(filterString.toLowerCase());
              if (index > -1) {
                  const highlightedSegment = data.substr(index, filterString.length);
                  if (index !== 0) {
                      textNode = document.createTextNode(data.substr(0, index));
                      spanNode.appendChild(textNode);
                  }
                  let bold = document.createElement("b");
                  textNode = document.createTextNode(highlightedSegment);
                  bold.appendChild(textNode);
                  spanNode.appendChild(bold);
                  if (index + filterString.length !== data.length) {
                      textNode = document.createTextNode(data.substr(index + filterString.length, data.length - 1));
                      spanNode.appendChild(textNode);
                  }
              }
              else {
                  textNode = document.createTextNode(data);
                  spanNode.appendChild(textNode);
              }
          }
          else {
              textNode = document.createTextNode(data);
              spanNode.appendChild(textNode);
          }
          context.parentElement.appendChild(spanNode);
      };
      this.columnArray = [
          { headerText: "Action", headerClassName: "tableHeaderStyle", width: "150", template: "cellTemplate" },
          { headerText: "Id", renderer: this.highlightingCellRenderer },
          { headerText: "Name", renderer: this.highlightingCellRenderer },
          { headerText: "Description", renderer: this.highlightingCellRenderer },
          { headerText: "Address", renderer: this.highlightingCellRenderer },
          { headerText: "Email", renderer: this.highlightingCellRenderer },
          { headerText: "Phone", renderer: this.highlightingCellRenderer },
          { headerText: "Website", renderer: this.highlightingCellRenderer },
      ];
    }


    return CustomerViewModel;
  }
);
