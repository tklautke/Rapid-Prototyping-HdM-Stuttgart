import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {isNotEmpty, isValidEmail, isValidPassword} from "shared";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: true,
    imports: [FormsModule, CommonModule]
})
export class LoginComponent {
    email = '';
    password = '';
    firstname = '';
    lastname = '';
    isDealer = false;
    errorMessage = '';
    errorMessagePassword = '';
    errorMessageEmail = '';
    errorMessageLastname = '';
    errorMessageFirstname = '';
    isRegister = false;

    constructor(private authService: AuthService, private router: Router) {
    }

    onLogin() {
        this.authService.login(this.email, this.password).subscribe({
            next: () => {
                this.router.navigate(['/appointment']);
            },
            error: (err) => {
                this.errorMessage = 'Anmeldung fehlgeschlagen';
            }
        });
    }

    onRegister() {
        const user = {
            email: this.email,
            password: this.password,
            firstname: this.firstname,
            lastname: this.lastname,
            isDealer: this.isDealer,
        };

        if (!isNotEmpty(user.firstname)) {
            this.errorMessageFirstname = "Vorname darf nicht leer sein";
        } else {
            this.errorMessageFirstname = "";
        }

        if (!isNotEmpty(user.lastname)) {
            this.errorMessageLastname = "Nachname darf nicht leer sein";
        } else {
            this.errorMessageLastname = "";
        }

        if (!isValidEmail(user.email)) {
            this.errorMessageEmail = "Email ist nicht valide";
        } else {
            this.errorMessageEmail = "";
        }

        if (!isValidPassword(user.password)) {
            this.errorMessagePassword = "Das Passwort muss mindestens 4 Zeichen lang sein und mindestens einen Großbuchstaben, " +
                "einen Kleinbuchstaben sowie eine Zahl enthalten.";
        } else {
            this.errorMessagePassword = "";
        }

        if (this.errorMessageFirstname || this.errorMessageLastname || this.errorMessageEmail || this.errorMessagePassword) {
            return;
        }

        this.authService.register(user).subscribe(
            (response) => {
                console.log('Benutzer erfolgreich registriert', response);
                this.toggleForm();
            },
            (error) => {
                console.log('Fehler bei der Registrierung', error);
                this.errorMessage = 'Fehler bei der Registrierung. Bitte versuchen Sie es erneut.';
            }
        );
    }


    toggleForm() {
        this.isRegister = !this.isRegister;
    }
}
