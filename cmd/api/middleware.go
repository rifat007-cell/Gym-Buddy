package main

import (
	"net/http"
	"time"

	"github.com/getsentry/sentry-go"
)

func (app *application) recoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				app.logger.Error("Panic recovered", "error", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(w, r)
	})
}


func (app *application) withSentry(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hub := app.sentry.Clone()
		hub.Scope().SetRequest(r)

		defer func() {
			if err := recover(); err != nil {
				hub.Recover(err)
				hub.Flush(2 * time.Second)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()

		r = r.WithContext(sentry.SetHubOnContext(r.Context(), hub))
		next.ServeHTTP(w, r)
	})
}
