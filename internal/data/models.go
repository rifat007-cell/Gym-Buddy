package data

import "database/sql"


type Models struct{
  Workouts WorkoutModel
	Exercises ExerciseModel
	Meals     MealsModel
	
}

func NewModels(db *sql.DB) Models {
	return Models{
		Workouts: WorkoutModel{DB: db},
		Exercises: ExerciseModel{DB: db},
		Meals:     MealsModel{DB: db},
	}
}