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
