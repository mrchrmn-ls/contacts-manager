export class Contact {
  constructor(id, full_name, email, phone_number, tagString) {
    this.id = id;
    this.full_name = full_name;
    this.email = email;
    this.phone_number = phone_number;
    this.tags = this.setFormattedTagString(tagString);
  }

  static fromData(contactData) {
    return Object.assign(new Contact(), contactData);
  }

  getTags() {
    if (!this.tags) return [];

    return this.tags.split(",");
  }

  setFormattedTagString(tagString) {
    this.tags = Array.from(new Set(tagString.split(",")
                                            .map(tag => tag.toLowerCase()
                                                           .trim()
                                                )
                                  )
                          ).join(",");
  }

  getDetails() {
    return Object.assign({}, this);
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
};