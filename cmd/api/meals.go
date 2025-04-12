package main

import "net/http"


func (app *application) getMealByWorkoutHandler(w http.ResponseWriter, r *http.Request){
	var input struct{
		Goal string `json:"goal"`
		DietaryPreference string `json:"dietary_preference"`
	}

	err:= app.readJSON(w,r,&input)

	if err!=nil{
		app.badRequestResponse(w,r,err)
		return
	}

	meals,err:=app.models.Meals.GetAllMealByWorkoutName(input.Goal,input.DietaryPreference)

	if err!=nil{
		app.serverErrorResponse(w,r,err)
		return
	}

	data:= envelope{"meals": meals}

	err = app.writeJSON(w, http.StatusOK, data, nil)

	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}




}