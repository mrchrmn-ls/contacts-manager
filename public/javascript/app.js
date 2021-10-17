import { ContactList } from "./contactlist.js";
import { UI } from "./ui.js"

document.addEventListener("DOMContentLoaded", async () => {

  new UI(await ContactList.makeList());

});