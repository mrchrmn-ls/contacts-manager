import { Contact } from "./contact";

export class ContactList {
  constructor() {
    this.contacts = [];
  }

  static async makeList() {
    let data = await API.getAll();
    let list = new ContactList();

    data.forEach(contactData => {
      list.contacts.push(Contact.fromData(contactData));
    });

    return list;
  }

  async add(contactData) {
    let contact = Contact.fromData(contactData);
    this.contacts.push(contact);
    await API.post(contact);
  }

  async update(contactData) {
    let contact = this.findById(contactData.id);

    contact.setName(contactData.full_name);
    contact.setEmail(contactData.email);
    contact.setPhone(contactData.phone_number);
    contact.setFormattedTagString(contactData.tags);

    await API.put(contact);
  }

  async delete(id) {
    let index = this.indexOf(id);
    this.contacts.slice(index, 1);
    await API.delete(id);
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
      if (contact.full_name.includes(string) ||
          contact.email.includes(string) ||
          contact.phone_number.includes(string) ||
          contact.tags.includes(string)) return true;
    });

    return filtered;
  }

  findByTags(tagArray) {
    let filtered = this.contacts.filter(contact => {
      return tagArray.some(tag => contact.getTags.includes(tag));
    })
  }

  getAll() {
    return this.contacts.slice();
  }

  getAllTags() {
    let allTags = this.contacts.reduce((tags, contact) => {
      tags.concat(contact.getTags())
    }, []);

    return Array.from(new Set(allTags));
  }
};