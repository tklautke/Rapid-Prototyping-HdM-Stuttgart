import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Appointment, User} from 'interfaces';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {

    private apiUrl = 'http://localhost:3000/Api/appointment';

    constructor(private http: HttpClient) {
    }

    public getAppointments(): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(this.apiUrl);
    }

    public deleteAppointment(id: number | undefined): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    public createAppointment(appointment: {
        date: string;
        vehicleOwner: User | undefined;
        assignment: string;
        time: string;
        branch: string;
        vehicleRegNo: string;
        status: string
    }): Observable<Appointment> {
        return this.http.post<Appointment>(this.apiUrl, appointment);
    }

    public updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {
        return this.http.put<Appointment>(`${this.apiUrl}/${appointment.id}`, appointment);
    }
}
