import { API } from "./services/API.js";
import Router from "./services/Router.js";

globalThis.addEventListener("DOMContentLoaded", () => {
  app.router.init();
});

globalThis.app = {
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
  router: Router,
  api: API,
};
