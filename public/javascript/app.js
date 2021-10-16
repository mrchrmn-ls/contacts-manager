class API {
  async getAll() {
    try {
      let response = await fetch("/api/contacts");
      return response.json();
    } catch(error) {
      console.log("Could not get contacts:\n" + error);
      return null;
    }
  }

  async post(contact) {
    try {
      let data = JSON.stringify(contact);
      await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: data
      });
    } catch(error) {
      console.log("Could not post contact:\n" + error);
      return null;
    }
  }

  async put(contact) {
    try {
      let data = JSON.stringify(contact);
      await fetch(`/api/contacts/${contact.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: data
      });
    } catch(error) {
      console.log("Could not post contact:\n" + error);
      return null;
    }
  }

  async delete(id) {
    try {
      await fetch(`/api/contacts/${id}`, {
        method: "DELETE"
      });
    } catch(error) {
      console.log("Could not delete contact:\n" + error);
      return null;
    }
  }
}


class Contact {
  constructor(id, full_name, email, phone_number, tags) {
    this.id = id;
    this.full_name = full_name;
    this.email = email;
    this.phone_number = phone_number;
    this.tags = this.setTags(tags);
  }

  static fromData(contactData) {
    return Object.assign(new Contact(), contactData);
  }

  getDetails() {
    return Object.assign({}, this);
  }

  getTags() {
    if (!this.tags) return [];

    return this.tags.split(",");
  }

  setName(newName) {
    this.full_name = newName;
  }

  setEmail(newEmail) {
    this.email = newEmail;
  }

  setPhone(newNumber) {
    this.phone_number = newNumber;
  }

  setTags(tagString) {
    this.tags = Array.from(new Set(tagString.split(",")
                                            .map(tag => tag.toLowerCase()
                                                           .trim()
                                                )
                                  )
                          ).join(",");
  }
}


class ContactList {
  constructor() {
    this.contacts = [];
  }

  static makeList() {
    let data = API.getAll();
    let list = new ContactList();

    data.forEach(contactData => {
      list.contacts.push(Contact.fromData(contactData));
    });

    return list;
  }

  add(contactData) {
    let contact = Contact.fromData(contactData);
    this.contacts.push(contact);
    API.post(contact);
  }

  update(contactData) {
    let contact = this.findById(contactData.id);

    contact.setName(contactData.full_name);
    contact.setEmail(contactData.email);
    contact.setPhone(contactData.phone_number);
    contact.setTags(contactData.tags);

    API.put(contact);
  }

  delete(id) {
    let index = this.indexOf(id);
    this.contacts.slice(index, 1);
    API.delete(id);
  }

  indexOf(id) {
    let index;
    this.contacts.forEach((contact, idx) => {
      if (contact.id === id) index = idx;
    });
    return index;
  }

  findById(id) {
    let filtered = this.contacts.filter(contact => contact.id === id);

    if (filtered.length > 0) {
      return this.contacts.filter(contact => contact.id === id)[0];
    } else {
      return null;
    }
  }

  findByString(string) {
    let filtered = this.contacts.filter(contact => {

    });

    return filtered;
  }

  findByTags(tags) {

  }

  getAll() {
    return this.contacts.slice();
  }
}