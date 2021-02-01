import { LightningElement } from "lwc";

export default class Container extends LightningElement {
  handleLookupselect(event) {
    console.log(event.detail);
  }
}
