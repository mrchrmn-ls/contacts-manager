import { Handle } from "./handle.js";


export class UI {
  constructor(contactList) {
    this.contactList = contactList;
    this.searchTags = [];
    this.elements = this.getElements();
    this.hb = this.getTemplateFunctions();
    this.renderTagList();
    this.renderContactList();
    Handle.addListeners(this);
  }

  getElements() {
    return {
      contactList: document.getElementById("contactList"),
      contacts: document.getElementsByClassName("contact"),
      tagList: document.getElementById("tagList"),
      tags: document.getElementsByClassName("tag"),
      searchInput: document.getElementById("searchInput"),
      clearButton: document.getElementById("clearButton"),
      newButton: document.getElementById("newButton"),
      searchScope: document.getElementById("searchScope"),
      namesOnly: document.getElementById("namesOnly"),
      status: document.getElementById("status"),
      searchTags: document.getElementById("searchTags"),
      addOrEdit: document.getElementById("addOrEdit")
    }
  }

  getTemplateFunctions() {
    return {
      contactList: Handlebars.compile(document.getElementById("contactlist-tmpl").innerHTML),
      tagList: Handlebars.compile(document.getElementById("taglist-tmpl").innerHTML),
      addOrEdit: Handlebars.compile(document.getElementById("addoredit-tmpl").innerHTML)
    }
  }


  renderTagList() {
    if (this.contactList.getAllTags().length !==0) {
      this.show(this.elements.searchTags);
      this.elements.tagList.innerHTML = this.hb.tagList({ tags: this.contactList.getAllTags() });
    } else {
      this.hide(this.elements.searchTags);
    }
  }

  renderContactList() {
    let contacts = this.contactList.contacts;
    if (contacts.length !== 0) {
      let contacts = this.contactList.getAll().map(contact => {
        if (contact.tags) {
          contact.tags = contact.tags.split(",").join(", ");
        }
        return contact;
      });
      this.elements.contactList.innerHTML = this.hb.contactList({ contacts });
    } else {
      this.displayStatus("There are no contacts yet. Why don't you add a new one?")
    }
  }

  renderAddOrEdit(id) {
    let contact = this.contactList.findById(id);
    let options = {};

    if (contact) {
      Object.assign(options, contact);
      this.displayStatus("Please edit and save the contact details.");
    } else {
      options["id"] = id;
      this.displayStatus("Please enter and save details for the new contact.");
    }

    this.elements.addOrEdit.innerHTML = this.hb.addOrEdit(options);
  }


  displaySearchResults(searchString, namesOnly) {
    let contactDivs = [...this.elements.contacts];
    let visibleIds = this.contactList.getVisibleIds(searchString, this.searchTags, namesOnly);

    contactDivs.forEach(div => {
      this.show(div);
      this.clearAllHighlights(div.querySelectorAll("h3, dd"));
  
      if (!visibleIds.includes(Number(div.id))) {
        this.hide(div);
      } else {
        if (!this.elements.namesOnly.checked) {
          this.highlightAll(div.querySelectorAll("h3, dd"), searchString);
        }
      }

      if (!visibleIds.includes(Number(div.id))) {
        this.hide(div);
      }
    });

    if (this.searchTags.length === 0 && searchString === "") {
      this.clearStatus();
    } else {
      this.displayStatus(`${visibleIds.length} ${visibleIds.length === 1 ? "contact" : "contacts"} found.`);
    }
  }


  displayStatus(message) {
    this.elements.status.textContent = message;
  }

  clearStatus() {
    this.elements.status.innerHTML = "";
  }


  highlightElement(element, string) {
    if (string) {
      let regexp = new RegExp(string, "gi");
      let newHTML = element.innerHTML.replace(regexp, `<mark>$&</mark>`);
      element.innerHTML = newHTML;  
    }
  }

  highlightAll(collection, string) {
    [...collection].forEach(element => {
      this.highlightElement(element, string);
    });
  }

  clearElementHighlights(element) {
    let regexp = new RegExp("(<mark>|</mark>)", "gi");
    let newHTML = element.innerHTML.replace(regexp, "");
    element.innerHTML = newHTML;
  }

  clearAllHighlights(collection) {
    [...collection].forEach(element => {
      this.clearElementHighlights(element);
    });
  }


  hide(element) {
    element.classList.add("hidden");
  }

  show(element) {
    element.classList.remove("hidden");
  }
}