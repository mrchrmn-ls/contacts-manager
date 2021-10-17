class Handle {
  static bindEvents(ui) {
    ui.elements.searchInput.addEventListener("input", Handle.searchInput.bind(ui));
  }

  static searchInput(event) {
    this.displaySearchResults(event.target.value);
  }
}


export class UI {
  constructor(contactList) {
    this.contactList = contactList;
    this.elements = this.getElements();
    this.hb = this.getTemplateFunctions();
    this.renderTagList();
    this.renderContactList();
    Handle.bindEvents(this);
  }

  getElements() {
    return {
      contactList: document.getElementById("contactList"),
      tagList: document.getElementById("tagList"),
      contacts: document.getElementsByClassName("contact"),
      searchInput: document.getElementById("searchInput"),
      newButton: document.getElementById("newButton")
    }
  }

  getTemplateFunctions() {
    return {
      contactList: Handlebars.compile(document.getElementById("contactlist-tmpl").innerHTML),
      tagList: Handlebars.compile(document.getElementById("taglist-tmpl").innerHTML)
    }
  }

  renderTagList() {
    this.elements.tagList.innerHTML = this.hb.tagList({ tags: this.contactList.getAllTags() });
  }

  renderContactList() {
    this.elements.contactList.innerHTML = this.hb.contactList({ contacts: this.contactList.getAll() });
  }

  displaySearchResults(searchString, searchTags) {
    let contactDivs = [...this.elements.contacts];
    let visibleIds = this.contactList.getVisibleIds(searchString, searchTags);

    console.log(visibleIds);

    contactDivs.forEach(div => {
      div.classList.remove("hidden");
      if (!visibleIds.includes(Number(div.id))) div.classList.add("hidden");
    });
  }
}