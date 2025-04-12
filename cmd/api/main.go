package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/tanvir-rifat007/gymBuddy/internal/data"
)


type config struct{
	Port int
	Env  string
	db struct{
		dsn string
	}
}

type application struct{
  logger *slog.Logger
	sentry *sentry.Hub
	config config
	models data.Models
}


func main(){
		logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	// get the dotenv file
	err:=godotenv.Load()

	if err != nil {
		logger.Error("Error loading .env file", "error", err)
	}

	// sentry 
	 err = sentry.Init(sentry.ClientOptions{
    Dsn: os.Getenv("SENTRY_DSN"),
  })
  if err != nil {
		logger.Error("Error initializing Sentry", "error", err)
  }

	// Flush buffered events before the program terminates.
  defer sentry.Flush(2 * time.Second)



	

	

	var cfg config


	flag.IntVar(&cfg.Port, "port", 4000, "API server port")
	flag.StringVar(&cfg.Env, "env", "development", "Environment (development|staging|production)")
	flag.StringVar(&cfg.db.dsn, "dsn", os.Getenv("DB_URL"), "Database connection string")
	flag.Parse()


	db,err:= openDB(cfg)
	if err!=nil{
		logger.Error("Error connecting to database", "error", err)
		os.Exit(1)
	}

	defer db.Close()

	logger.Info("Connected to database", "dsn", cfg.db.dsn)


	app := &application{
		logger: logger,
		config: cfg,
		sentry : sentry.CurrentHub(),
		models: data.NewModels(db),
	}

	logger.Info("Starting application", "port", cfg.Port, "env", cfg.Env)

	srv:= &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: app.routes(),
		ReadTimeout: time.Second * 5,
		WriteTimeout: time.Second * 10,
		IdleTimeout: time.Second * 120,
	}

	
	err = srv.ListenAndServe()

	if err != nil {
		logger.Error("Error starting server", "error", err)
		os.Exit(1)
	}


}


func openDB(cfg config)(*sql.DB,error){
	db,err:= sql.Open("postgres",cfg.db.dsn)

	if err!=nil{
		return nil,err
	}

	ctx,cancel:= context.WithTimeout(context.Background(),5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)

	if err!=nil{
		return nil,err
	}

	return db,nil
}