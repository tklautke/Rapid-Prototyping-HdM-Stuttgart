import {Route} from '@angular/router';
import {AppointmentDetailViewComponent} from "./appointment-detail-view/appointment-detail-view.component";
import {DealerDetailViewComponent} from "./dealer-detail-view/dealer-detail-view.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth.guard";
import {CalendarComponent} from './calendar/calendar.component';

export const appRoutes: Route[] = [
    {path: 'login', component: LoginComponent},
    {path: 'appointment', component: AppointmentDetailViewComponent, canActivate: [AuthGuard]},
    {path: 'dealer', component: DealerDetailViewComponent, canActivate: [AuthGuard]},
    {path: 'calender', component: CalendarComponent, canActivate: [AuthGuard]},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {
        path: '**',
        canActivate: [AuthGuard],
        component: AppointmentDetailViewComponent,
        data: {redirectTo: '/login'}
    }
];