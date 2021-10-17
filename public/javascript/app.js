import { Contact } from "./contact.js";
import { ContactList } from "./contact-list.js";

class Display {
  static searchResults(contactList, searchString, searchTags) {
    let contactDivs = [...document.getElementById("contactList").querySelectorAll(".contact")];
    let visibleIds = contactList.getVisibleIds(searchString, searchTags);

    contactDivs.forEach(div => {
      console.log(div.id);
      if (!visibleIds.includes(Number(div.id))) div.classList.add("hidden");
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {

  let contactList = await ContactList.makeList();

  let tagListTmpl = document.getElementById("taglist-tmpl").innerHTML;
  let HbTagList = Handlebars.compile(tagListTmpl);

  document.getElementById("tagList").innerHTML = HbTagList({ tags: contactList.getAllTags() });


  let contactListTmpl = document.getElementById("contactlist-tmpl").innerHTML;
  let HbContactList = Handlebars.compile(contactListTmpl);

  document.getElementById("contactList").innerHTML = HbContactList({ contacts: contactList.getAll() });
});