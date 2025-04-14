package main

import "net/http"


func (app *application) routes() http.Handler {
	mux:= http.NewServeMux()


  mux.Handle("GET /",http.FileServer(http.Dir("./public")))

		mux.HandleFunc("GET /workout",app.catchAllClientRequestHandler)
		mux.HandleFunc("GET /meal",app.catchAllClientRequestHandler)
		mux.HandleFunc("GET /account/",app.catchAllClientRequestHandler)
				mux.HandleFunc("GET /activated",app.catchAllClientRequestHandler)




	

	// sentry middleware
	mux.Handle("GET /v1/healthcheck", app.recoverPanic(app.withSentry(http.HandlerFunc(app.healthCheckHandler))))

	
	mux.Handle("POST /v1/workouts", app.recoverPanic(app.withSentry(http.HandlerFunc(app.getExercisesByWorkoutHandler))))

	mux.Handle("POST /v1/meals", app.recoverPanic(app.withSentry(http.HandlerFunc(app.getMealByWorkoutHandler))))

	mux.Handle("POST /v1/account/register", app.recoverPanic(app.withSentry(http.HandlerFunc(app.registerUserHandler))))

	mux.Handle("POST /v1/account/login", app.recoverPanic(app.withSentry(http.HandlerFunc(app.loginUserHandler))))

	 mux.Handle("GET /v1/account/activate", app.recoverPanic(app.withSentry(http.HandlerFunc(app.activateUserHandler))))


	return mux
}