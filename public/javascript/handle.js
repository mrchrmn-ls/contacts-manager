import { Contact } from "./contact.js"

export class Handle {
  static addListeners(ui) {
    ui.elements.searchInput.addEventListener("input", Handle.updateSearchResults.bind(ui));
    ui.elements.searchInput.addEventListener("keydown", Handle.searchInputKeydown);
    ui.elements.tagList.addEventListener("click", Handle.tagClick.bind(ui));
    ui.elements.clearButton.addEventListener("click", Handle.updateSearchResults.bind(ui));
    ui.elements.searchScope.addEventListener("click", Handle.updateSearchResults.bind(ui));
    ui.elements.contactList.addEventListener("click", Handle.contactClick.bind(ui));
    ui.elements.newButton.addEventListener("click", Handle.newClick.bind(ui));
    ui.elements.addOrEdit.addEventListener("click", Handle.contactFormClick.bind(ui));
  }

  static searchInputKeydown(event) {
    if (event.key === "Enter") event.preventDefault();
  }

  // IMPORTANT: 
  // All methods below are bound to an instance of the UI class.

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

  static newClick(event) {
    event.preventDefault();
    let id = this.contactList.generateId();

    this.renderAddOrEdit(id);    
    this.hide(this.elements.contactList);
    this.show(this.elements.addOrEdit);
    document.getElementById("fullName").focus();
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
        this.renderAddOrEdit(id);
        this.hide(this.elements.contactList);
        this.show(this.elements.addOrEdit);
        document.getElementById("fullName").focus();
        break;
    }
  }

  static async contactFormClick(event) {
    event.preventDefault();

    switch (event.target.className) {
      case "save":
        let contactData = {
          id: document.getElementById("id").value,
          full_name: document.getElementById("fullName").value,
          phone_number: document.getElementById("phoneNumber").value,
          email: document.getElementById("email").value,
          tags: Contact.formatTags(document.getElementById("tags").value)
        }

        if (this.contactList.findById(contactData.id)) {
          await this.contactList.update(contactData);
        } else {
          await this.contactList.add(contactData);
        }

        this.elements.addOrEdit.innerHTML = "";
        this.elements.searchInput.value = "";
        this.renderContactList();
        this.renderTagList();
        this.hide(this.elements.addOrEdit);
        this.show(this.elements.contactList);

        break;

      case "cancel":
        this.elements.addOrEdit.innerHTML = "";
        this.hide(this.elements.addOrEdit);
        this.show(this.elements.contactList);
        break;
    }
  }
}