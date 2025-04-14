const jwtFromStorage = localStorage.getItem("jwt");

const email = jwtFromStorage ? jwtDecode(jwtFromStorage)?.email : null;

const Store = {
  jwt: jwtFromStorage,
  email: email,
  get loggedIn() {
    return this.jwt !== null;
  },
};

const proxiedStore = new Proxy(Store, {
  set: (target, prop, value) => {
    if (prop === "jwt") {
      target[prop] = value;
      localStorage.setItem("jwt", value);

      try {
        // get the email from jwt and set it to the store.
        target.email = jwtDecode(value)?.email || null;
      } catch {
        target.email = null;
      }
    } else if (prop === "email") {
      target[prop] = value;
    }

    return true;
  },
});

export default proxiedStore;
