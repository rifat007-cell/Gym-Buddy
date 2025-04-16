package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func (app *application) serve()error{
	srv:= &http.Server{
		Addr: fmt.Sprintf(":%d", app.config.Port),
		Handler: app.routes(),
		IdleTimeout: time.Minute,
		ReadTimeout: 5 * time.Second,
		WriteTimeout: 10 * time.Second,
		ErrorLog: slog.NewLogLogger(app.logger.Handler(),slog.LevelError),
	}

	  shutdownError:= make(chan error)

	    go func() {
        // Create a quit channel which carries os.Signal values.
        quit := make(chan os.Signal, 1)

        // Use signal.Notify() to listen for incoming SIGINT and SIGTERM signals and 
        // relay them to the quit channel. Any other signals will not be caught by
        // signal.Notify() and will retain their default behavior.
        signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

        // Read the signal from the quit channel. This code will block until a signal is
        // received.
        s := <-quit

        // Log a message to say that the signal has been caught. Notice that we also
        // call the String() method on the signal to get the signal name and include it
        // in the log entry attributes.
        app.logger.Info("shutting down server", "signal", s.String())

				ctx,cancel:=context.WithTimeout(context.Background(),30*time.Second)

				defer cancel()

				// Call the Shutdown() method on the server, passing in the context we created

				 shutdownError <- srv.Shutdown(ctx)


    }()


	app.logger.Info("starting server","port",app.config.Port,"env",app.config.Env)

	err:=srv.ListenAndServe()

	if !errors.Is(err,http.ErrServerClosed){
		return err;
	}

	// Wait for the shutdown to complete
	err=<-shutdownError

	if err!=nil{
		return  err
	}
	app.logger.Info("stopped server","addr",srv.Addr)

	return nil
}