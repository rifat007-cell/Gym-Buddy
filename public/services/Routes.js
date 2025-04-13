import { HomePage } from "../components/HomePage.js";
import { WorkoutPage } from "../components/WorkoutPage.js";

export const routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/workout",
    component: WorkoutPage,
  },
];
