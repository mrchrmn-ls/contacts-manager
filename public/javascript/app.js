class API {
  get(id) {

  }

  post(contact) {

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

  getName() {
    return this.full_name;
  }

  setName(newName) {
    this.full_name = newName;
  }

  getEmail() {
    return this.email;
  }

  setEmail(newEmail) {
    this.email = newEmail;
  }

  getPhone() {
    return this.phone_number;
  }

  setPhone(newNumber) {
    this.phone_number = newNumber;
  }

  getTags() {
    if (!this.tags) return [];

    return this.tags.split(",");
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
    let data = API.get();
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