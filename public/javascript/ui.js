class Handle {
  static addListeners(ui) {
    ui.elements.searchInput.addEventListener("input", Handle.updateSearchResults.bind(ui));
    ui.elements.searchInput.addEventListener("keydown", Handle.searchInputKeydown);
    ui.elements.tagList.addEventListener("click", Handle.tagClick.bind(ui));
    ui.elements.clearButton.addEventListener("click", Handle.updateSearchResults.bind(ui));
    ui.elements.searchScope.addEventListener("click", Handle.updateSearchResults.bind(ui));
    ui.elements.contactList.addEventListener("click", Handle.contactClick.bind(ui))
  }

  static searchInputKeydown(event) {
    if (event.key === "Enter") event.preventDefault();
  }

  // Don't forget: In method below this line "this" references UI instance

  static tagClick(event) {
    event.preventDefault();
    event.target.classList.toggle("active");
    this.searchTags = [...this.elements.tags].filter(tag => tag.classList.contains("active"))
                                             .map(tag => tag.textContent);
    this.displaySearchResults(this.elements.searchInput.value,
                              this.elements.namesOnly.checked);
  }

  static updateSearchResults() {
    setTimeout(() => { 
      this.displaySearchResults(this.elements.searchInput.value, 
                                this.elements.namesOnly.checked) 
    }, 1);
  }

  static async contactClick(event) {
    event.preventDefault();
    let id;

    switch (event.target.className) {
      case "delete":
        id = event.target.parentElement.id;
        if (confirm(`Are you sure you want to delete the contact? This cannot be undone.`)) {
          await this.contactList.delete(id);
          this.renderContactList();
          this.renderTagList();
        }
        break;

      case "edit":
        id = event.target.parentElement.id;
        this.renderContactForm("edit", id);
        this.hide(this.elements.contactList);
        this.show(this.elements.addEdit);
        break;
    }
  }
}


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
      contactForm: document.getElementById("addEdit")
    }
  }

  getTemplateFunctions() {
    return {
      contactList: Handlebars.compile(document.getElementById("contactlist-tmpl").innerHTML),
      tagList: Handlebars.compile(document.getElementById("taglist-tmpl").innerHTML),
      contactForm: Handlebars.compile(documenr.getElementById("contactform-tmpl").innerHTML)
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

  renderContactForm(type, id) {
    
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
      console.log("highlighting");
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