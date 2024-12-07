import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Dealer} from 'interfaces';

@Injectable({
    providedIn: 'root'
})
export class DealerService {

    private apiUrl = 'http://localhost:3000/api/dealer';

    constructor(private http: HttpClient) {
    }

    /**
     * Retrieves all dealers from the backend.
     * @returns An observable of an array of Dealer objects.
     */
    public getDealers(): Observable<Dealer[]> {
        return this.http.get<Dealer[]>(this.apiUrl);
    }

    /**
     * Deletes a dealer by ID.
     * @param id - The ID of the dealer to be deleted.
     * @returns An observable of void.
     */
    public deleteDealer(id: number | undefined): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Creates a new dealer.
     * @param dealer - The dealer data to be created.
     * @returns An observable of the created Dealer object.
     */
    public createDealer(dealer: Dealer): Observable<Dealer> {
        return this.http.post<Dealer>(this.apiUrl, dealer);
    }

    /**
     * Updates an existing dealer by ID.
     * @param id - The ID of the dealer to be updated.
     * @param dealer - The updated dealer data.
     * @returns An observable of the updated Dealer object.
     */
    public updateDealer(id: number | undefined, dealer: Dealer): Observable<Dealer> {
        return this.http.put<Dealer>(`${this.apiUrl}/${id}`, dealer);
    }
}
