import { API } from "./services/API.js";
import { Passkeys } from "./services/Passkeys.js";
import Router from "./services/Router.js";
import Store from "./services/Store.js";

globalThis.addEventListener("DOMContentLoaded", () => {
  app.router.init();
});

globalThis.app = {
  showError: (message = "There was an error.", goToHome = false) => {
    const modal = document.getElementById("alert-modal");

    modal.innerHTML = "";

    modal.showModal();

    const p = document.createElement("p");
    p.innerText = message;
    p.style.fontSize = "1.5rem";
    p.classList.add("error-message");

    modal.appendChild(p);

    if (goToHome) {
      setTimeout(() => {
        app.router.go("/");
        app.closeModal();
      }, 3000);
    }
  },
  closeModal: () => {
    document.querySelector("#alert-modal").close();
  },
  sendWorkoutData: async (event) => {
    event.preventDefault();
    const goal = document.querySelector("#goal").value;
    const label = document.querySelector("#level").value;

    const data = {
      goal: goal,
      label: label,
    };

    const res = await API.getWorkouts(data);

    const modal = document.getElementById("alert-modal");

    Array.from(modal.querySelectorAll(".meal-modal, .workout-modal")).forEach(
      (el) => el.remove()
    );

    document.getElementById("alert-modal").showModal();

    if (!res.workouts) {
      const workoutElement = document.createElement("div");
      workoutElement.classList.add("workout-modal");
      workoutElement.innerHTML = `
        <p>No workouts found</p>
      `;
      modal.appendChild(workoutElement);
      return;
    }

    res.workouts.forEach((workout) => {
      const workoutElement = document.createElement("div");
      workoutElement.classList.add("workout-modal");
      workoutElement.innerHTML = `
    
        <p>${workout.exercises[0].name}(${workout.exercises[0].sets})x(${workout.exercises[0].reps})</p>
      `;
      modal.appendChild(workoutElement);
    });

    console.log(res);
  },

  sendMealData: async (event) => {
    event.preventDefault();
    const goal = document.querySelector("#goal").value;
    const dietary = document.querySelector("#dietary").value;

    const data = {
      goal: goal,
      dietary_preference: dietary,
    };

    const res = await API.getMeals(data);

    const modal = document.getElementById("alert-modal");

    document.getElementById("alert-modal").showModal();

    Array.from(modal.querySelectorAll(".meal-modal, .workout-modal")).forEach(
      (el) => el.remove()
    );

    if (!res.meals) {
      const mealElements = document.createElement("div");
      mealElements.classList.add("meal-modal");
      mealElements.innerHTML = `
        <p>No workouts found</p>
      `;
      modal.appendChild(mealElements);
      return;
    }

    res.meals.forEach((meal) => {
      const mealElements = document.createElement("div");
      mealElements.classList.add("meal-modal");
      mealElements.innerHTML = `
    
        <p>Name : ${meal.name} <span style="color:hsl(20, 95%, 23%)">(${meal.calories}cal)</span></p>
        <p>Description: ${meal.description}</p>
        <br/>
      `;
      modal.appendChild(mealElements);
    });

    console.log(res);
  },

  register: async (event) => {
    event.preventDefault();
    let errors = [];

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const passwordConfirm = document.getElementById(
      "register-password-confirm"
    ).value;

    if (name.length < 4) errors.push("Enter your complete name");
    if (email.length < 8) errors.push("Enter your complete email");
    if (password.length < 6) errors.push("Enter a password with 6 characters");
    if (password != passwordConfirm) errors.push("Passwords don't match");

    console.log(errors);

    if (errors.length == 0) {
      const data = {
        name: name,
        email: email,
        password: password,
      };
      const response = await API.register(data);
      if (response.user) {
        app.store.jwt = response.user.jwt;
        app.store.activated = response.user.activated;

        app.router.go("/account/");
      } else {
        app.showError(response.message, false);
      }
    } else {
      app.showError(errors.join(". "), false);
    }
  },

  login: async (event) => {
    event.preventDefault();
    let errors = [];

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (email.length < 8) errors.push("Enter your complete email");
    if (password.length < 6) errors.push("Enter a password with 6 characters");

    console.log(errors);

    if (errors.length == 0) {
      const data = {
        email: email,
        password: password,
      };
      const response = await API.login(data);
      if (response.user) {
        app.store.jwt = response.user.jwt;
        app.store.activated = response.user.activated;

        app.router.go("/account/");
      } else {
        app.showError(response.message, false);
      }
    } else {
      app.showError(errors.join(". "), false);
    }
  },

  logout: () => {
    app.store.jwt = null;
    app.router.go("/");
  },

  workoutLog: async (event) => {
    event.preventDefault();
    const data = {
      exercise: document.querySelector("#log-workoutname").value,
      sets: document.querySelector("#log-workoutsets").value,
      reps: document.querySelector("#log-workoutreps").value,
      duration: document.querySelector("#log-workoutduration").value,
      weight: document.querySelector("#log-workoutweight").value,
    };

    try {
      const res = await API.postWorkoutLog(data);
      console.log(res);
      app.router.go("/dashboard");
    } catch (error) {
      console.error("Error posting workout log:", error);
      app.showError("Error posting workout log", false);
    }
  },

  addPasskey: async () => {
    const username = "testuser";
    await Passkeys.register(username);
  },

  loginWithPasskey: async () => {
    const username = document.getElementById("login-email").value;
    if (username.length < 4) {
      app.showError("To use a passkey, enter your email address first");
    } else {
      await Passkeys.authenticate(username);
    }
  },

  store: Store,
  router: Router,
  api: API,
};
