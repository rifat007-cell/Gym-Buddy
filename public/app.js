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

    document.getElementById("alert-modal").showModal();
    // document.querySelector("#alert-modal p").textContent = res.workouts;
    console.log(res.workouts);

    // Clear previous workouts
    const workoutElements = document.querySelectorAll(".workout-modal");

    console.log(workoutElements);

    workoutElements.forEach((element) => {
      element.remove();
    });

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
  router: Router,
  api: API,
};
