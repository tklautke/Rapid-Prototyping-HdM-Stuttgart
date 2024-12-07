import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppointmentDetailViewComponent} from "./appointment-detail-view/appointment-detail-view.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {DealerDetailViewComponent} from "./dealer-detail-view/dealer-detail-view.component";
import {CalendarComponent} from "./calendar/calendar.component";

@Component({
    standalone: true,
    imports: [RouterModule, AppointmentDetailViewComponent, NavbarComponent, DealerDetailViewComponent, CalendarComponent],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'Appointment App';
}
