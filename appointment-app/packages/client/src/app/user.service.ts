import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from 'interfaces'; // Stelle sicher, dass der User-Typ korrekt importiert wird

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = 'http://localhost:3000/api/user'; // Der Endpunkt für Benutzer im Backend

    constructor(private http: HttpClient) {
    }

    /**
     * Retrieves all users from the backend.
     * @returns An observable of an array of User objects.
     */
    public getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    /**
     * Retrieves a single user by ID from the backend.
     * @param id - The ID of the user to be retrieved.
     * @returns An observable of the User object.
     */
    public getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    /**
     * Creates a new user.
     * @param user - The user data to be created.
     * @returns An observable of the created User object.
     */
    public createUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    /**
     * Updates an existing user by ID.
     * @param id - The ID of the user to be updated.
     * @param user - The updated user data.
     * @returns An observable of the updated User object.
     */
    public updateUser(id: number, user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user);
    }

    /**
     * Deletes a user by ID.
     * @param id - The ID of the user to be deleted.
     * @returns An observable of void.
     */
    public deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
