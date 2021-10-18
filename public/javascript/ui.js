class Handle {
  static addListeners(ui) {
    ui.elements.searchInput.addEventListener("input", Handle.updateSearchResults.bind(ui));
    ui.elements.tagList.addEventListener("click", Handle.tagClick.bind(ui));
    ui.elements.clearButton.addEventListener("click", Handle.updateSearchResults.bind(ui));
    ui.elements.searchScope.addEventListener("click", Handle.updateSearchResults.bind(ui));
    ui.elements.contactList.addEventListener("click", Handle.contactClick.bind(ui))
  }

  // Don't forget: "this" usually references UI instance

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

  static contactClick(event) {
    event.preventDefault();
    if (event.target.className === "delete") {
      alert("Are you sure?");
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
      status: document.getElementById("status")
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

  displaySearchResults(searchString, namesOnly) {
    let contactDivs = [...this.elements.contacts];
    let visibleIds = this.contactList.getVisibleIds(searchString, this.searchTags, namesOnly);

    contactDivs.forEach(div => {
      div.classList.remove("hidden");

      if (!visibleIds.includes(Number(div.id))) {
        div.classList.add("hidden");
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
}