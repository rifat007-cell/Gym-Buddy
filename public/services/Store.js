const jwtFromStorage = localStorage.getItem("jwt");

const email = jwtFromStorage ? jwtDecode(jwtFromStorage)?.email : null;

const Store = {
  jwt: jwtFromStorage,
  email: email,
  activated: false,
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
        target.activated = jwtDecode(value)?.activated || false;
      } catch {
        target.email = null;
        target.activated = false;
      }
    } else if (prop === "email") {
      target[prop] = value;
    } else if (prop === "activated") {
      target[prop] = value;
    }

    return true;
  },
});

export default proxiedStore;
