import { LightningElement, wire, api, track } from "lwc";
import fetchRecords from "@salesforce/apex/lightningInputLookupController.fetchRecords";

const DELAY = 300;
export default class LightningInputLookupSingleSelect extends LightningElement {
  @api sObjectApiName = "Account";
  @track searchTerm = "";

  @track lookupItems = [];

  selectedItemName = "";
  selectedItemId;
  delayTimeout;
  @wire(fetchRecords, {
    sObjectApiName: "$sObjectApiName",
    searchTerm: "$searchTerm"
  })
  returnedData({ error, data }) {
    if (data) {
      console.log(data);
      this.lookupItems = [];
      data = JSON.parse(JSON.stringify(data));
      data.forEach((element) => {
        this.lookupItems.push({
          id: element.Id,
          name: element.Name,
          selected: false
        });
      });
    } else if (error) {
      console.log(error);
    }
  }
  showListItems(event) {
    this.template
      .querySelector(".slds-dropdown-trigger")
      .classList.add("slds-is-open");
  }
  hideListItems(event) {
    this.template
      .querySelector(".slds-dropdown-trigger")
      .classList.remove("slds-is-open");
  }

  showInputBox(event) {
    this.template.querySelector(".input-box").classList.remove("slds-hide");
    this.template.querySelector(".selected-box").classList.add("slds-hide");
    this.template
      .querySelector(".slds-combobox_container")
      .classList.remove("slds-has-selection");
  }
  showSelectedBox(event) {
    this.template.querySelector(".selected-box").classList.remove("slds-hide");
    this.template.querySelector(".input-box").classList.add("slds-hide");
    this.template
      .querySelector(".slds-combobox_container")
      .classList.add("slds-has-selection");
  }

  handleSearchInput(event) {
    let searchTerm = event.target.value;
    searchTerm = searchTerm.trim();
    window.clearTimeout(this.delayTimeout);
    this.delayTimeout = setTimeout(() => {
      this.searchTerm = searchTerm;
    }, DELAY);
  }
  handleItemSelect(event) {
    this.selectedItemId = event.currentTarget.dataset.id;
    this.selectedItemName = event.currentTarget.dataset.name;
    this.markItemSelected(this.selectedItemId);
    this.hideListItems();
    this.showSelectedBox();

    // Creates the event with the contact ID data.
    const selectedEvent = new CustomEvent("selected", {
      detail: this.selectedItemId
    });
    this.dispatchEvent(selectedEvent);
  }
  handleRemoveItem(event) {
    let removeItemId = event.target.dataset.id;
    this.selectedItemId = "";
    this.selectedItemName = "";
    this.markAllItemUnSelect();
    this.showInputBox();

    // Creates the event with the contact ID data.
    const removeEvent = new CustomEvent("removed", {
      detail: this.selectedItemId
    });
    this.dispatchEvent(removeEvent);
  }

  markItemSelected(item) {
    this.lookupItems.forEach((element) => {
      if (element.id === item) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });
  }
  markAllItemUnSelect() {
    this.lookupItems.forEach((element) => {
      element.selected = false;
    });
  }
}
