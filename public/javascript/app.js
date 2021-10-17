import { ContactList } from "./contact-list.js";
import { UI } from "./ui-handle.js"

document.addEventListener("DOMContentLoaded", async () => {

  new UI(await ContactList.makeList());

});