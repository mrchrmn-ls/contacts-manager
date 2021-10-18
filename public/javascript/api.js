export class API {
  static async getAll() {
    try {
      let response = await fetch("/api/contacts");
      return await response.json();
    } catch(error) {
      console.log("Could not get contacts:\n" + error);
      return null;
    }
  }

  static async post(contact) {
    try {
      let data = JSON.stringify(contact);
      await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: data
      });
      return true;
    } catch(error) {
      console.log("Could not post contact:\n" + error);
      return null;
    }
  }

  static async put(contact) {
    try {
      let data = JSON.stringify(contact);
      await fetch(`/api/contacts/${contact.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: data
      });
      return true;
    } catch(error) {
      console.log("Could not post contact:\n" + error);
      return null;
    }
  }

  static async delete(id) {
    try {
      await fetch(`/api/contacts/${id}`, {
        method: "DELETE"
      });
      return true;
    } catch(error) {
      console.log("Could not delete contact:\n" + error);
      return null;
    }
  }
};