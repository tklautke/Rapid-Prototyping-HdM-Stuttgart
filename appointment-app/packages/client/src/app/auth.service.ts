import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {User} from 'interfaces';
import {jwtDecode} from "jwt-decode";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public currentUser: Observable<User | null>;
    private apiUrl = 'http://localhost:3000/api/user';
    private currentUserSubject: BehaviorSubject<User | null>;

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    /**
     * Returns the current logged-in user's data.
     * @returns The current user object.
     */
    get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    /**
     * Logs the user in by sending a POST request with email and password.
     * @param email - The user's email address.
     * @param password - The user's password.
     * @returns An observable of the user object on successful login.
     */
    login(email: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/login`, {email, password}).pipe(
            tap((user) => {
                // Store the user data (including token) if login is successful
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user); // Update the BehaviorSubject with the logged-in user
            })
        );
    }

    /**
     * Registers a new user by sending a POST request with the user data.
     * @param user - The user data to register.
     * @returns An observable of the registered user object.
     */
    register(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}`, user);
    }

    /**
     * Logs the user out by clearing user data from localStorage and updating the BehaviorSubject.
     */
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    /**
     * Checks if the user is authenticated.
     * @returns True if the user is authenticated, false otherwise.
     */
    isAuthenticated(): boolean {
        return !!this.currentUserValue;
    }

    public isDealer(): boolean {
        const parsedData = JSON.parse(<string>localStorage.getItem('currentUser'));
        const decodedToken: any = jwtDecode(parsedData.accessToken);
        return decodedToken.isDealer;
    }

    public getMailFromJWT(): string {
        const parsedData = JSON.parse(<string>localStorage.getItem('currentUser'));
        const decodedToken: any = jwtDecode(parsedData.accessToken);
        return decodedToken.email;
    }
}
