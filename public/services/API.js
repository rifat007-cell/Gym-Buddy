export const API = {
  baseURL: "http://localhost:4000/v1",

  getWorkouts: (data) => {
    if (app.store.activated) {
      return API.fetchData("/workouts", data);
    }
    return {
      workouts: null,
    };
  },
  getMeals: (data) => {
    if (app.store.activated) {
      return API.fetchData("/meals", data);
    }

    return {
      meals: null,
    };
  },

  getDashboardData: () => {
    if (app.store.activated) {
      return API.fetchVolume("/workout_log_volume");
    }
    return {
      volume: null,
    };
  },

  fetchVolume: async (url) => {
    try {
      const response = await fetch(API.baseURL + url, {
        headers: {
          Authorization: app.store.jwt ? `Bearer ${app.store.jwt}` : "",
        },
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Network response was not ok");
      }
      const res = await response.json();

      return res;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  postWorkoutLog: (data) => {
    if (app.store.activated) {
      return API.fetchData("/workout_log", data);
    }
    return {
      workoutlog: null,
    };
  },

  register: (data) => {
    return API.fetchData("/account/register", data);
  },
  login: (data) => {
    return API.fetchData("/account/login", data);
  },

  fetchData: async (url, data = {}) => {
    try {
      const response = await fetch(API.baseURL + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: app.store.jwt ? `Bearer ${app.store.jwt}` : "",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Network response was not ok");
      }
      const res = await response.json();

      return res;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
};
