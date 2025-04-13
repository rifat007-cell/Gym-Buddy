package data

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/tanvir-rifat007/gymBuddy/validator"
	"golang.org/x/crypto/bcrypt"
)

var (
    ErrDuplicateEmail = errors.New("duplicate email")
)



type User struct{
	ID int `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	Name string `json:"name"`
	Email string `json:"email"`
	Password password `json:"-"`
	Activated bool `json:"activated"`
	Version int `json:"-"`
  JWT string `json:"jwt,omitempty"`
	
}

type password struct{
	plaintext *string 
	hash []byte

}

type UserModel struct{
	DB *sql.DB
}

func (p *password) Set(plaintext string) error{
	hash,err:=bcrypt.GenerateFromPassword([]byte(plaintext),bcrypt.DefaultCost)

	if err!=nil{
		return err
	}
	p.plaintext = &plaintext
	p.hash = hash

	

	return nil
}

func (p *password) Matches(plaintext string) (bool,error){
    err:= bcrypt.CompareHashAndPassword(p.hash,[]byte(plaintext))

	if err!=nil{
		if errors.Is(err,bcrypt.ErrMismatchedHashAndPassword){
			return false,nil
		}
		return false,err

	}
	return true,nil
}

func (m UserModel) Insert(user *User) error{
	stmt:= `INSERT INTO users (name,email,password_hash,activated)
	        VALUES($1,$2,$3,$4) RETURNING id,created_at,version`

	args:= []any{user.Name,user.Email,user.Password.hash,user.Activated}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)

	defer cancel()

	err:= m.DB.QueryRowContext(ctx,stmt,args...).Scan(&user.ID,&user.CreatedAt,&user.Version)

	  if err != nil {
        switch {
        case err.Error() == `pq: duplicate key value violates unique constraint "users_email_key"`:
            return ErrDuplicateEmail
        default:
            return err
        }
			}

	return nil
}


func ValidateEmail(v *validator.Validator, email string) {
    v.Check(email != "", "email", "must be provided")
    v.Check(validator.Matches(email, validator.EmailRX), "email", "must be a valid email address")
}

func ValidatePasswordPlaintext(v *validator.Validator, password string) {
    v.Check(password != "", "password", "must be provided")
    v.Check(len(password) >= 8, "password", "must be at least 8 bytes long")
    v.Check(len(password) <= 72, "password", "must not be more than 72 bytes long")
}

func ValidateUser(v *validator.Validator, user *User) {
    v.Check(user.Name != "", "name", "must be provided")
    v.Check(len(user.Name) <= 500, "name", "must not be more than 500 bytes long")

    // Call the standalone ValidateEmail() helper.
    ValidateEmail(v, user.Email)

    // If the plaintext password is not nil, call the standalone 
    // ValidatePasswordPlaintext() helper.
    if user.Password.plaintext != nil {
        ValidatePasswordPlaintext(v, *user.Password.plaintext)
    }

    // If the password hash is ever nil, this will be due to a logic error in our 
    // codebase (probably because we forgot to set a password for the user). It's a 
    // useful sanity check to include here, but it's not a problem with the data 
    // provided by the client. So rather than adding an error to the validation map we 
    // raise a panic instead.
    if user.Password.hash == nil {
        panic("missing password hash for user")
    }
}