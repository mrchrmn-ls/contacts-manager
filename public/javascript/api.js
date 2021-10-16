export class API {
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
};