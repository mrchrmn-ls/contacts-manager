export class Contact {
  constructor(id, full_name, email, phone_number, tags) {
    this.id = id;
    this.full_name = full_name;
    this.email = email;
    this.phone_number = phone_number;
    this.tags = tags;
  }

  // restore proper Contact object from JSON data
  static fromData(contactData) {
    return Object.assign(new Contact(), contactData);
  }


  // Getters //

  getDetails() {
    return Object.assign({}, this);
  }

  getTags() {
    if (!this.tags) return [];

    return this.tags.split(",");
  }


  // Setters //

  // converts input string into properly formatted string
  setTags(inputString) {
    this.tags = Array.from(new Set(inputString.split(",")
                                            .map(tag => tag.toLowerCase()
                                                           .trim()
                                                )
                                  )
                          ).join(",");
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