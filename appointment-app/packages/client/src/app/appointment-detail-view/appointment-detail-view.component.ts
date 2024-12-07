import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppointmentService} from "../appointment.service";
import {Appointment, Dealer, User} from "interfaces";
import {NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {UserService} from "../user.service";
import {AuthService} from "../auth.service";
import {isInOpeningTime, isNotEmpty, isValidVehicleRegNo} from "shared";
import {DealerService} from "../dealer.service";

@Component({
    selector: 'app-appointment-detail-view',
    standalone: true,
    imports: [CommonModule, NgbInputDatepicker, FormsModule],
    templateUrl: './appointment-detail-view.component.html',
    styleUrls: ['./appointment-detail-view.component.scss'],
})
export class AppointmentDetailViewComponent implements OnInit {

    public appointmentList: Appointment[] = [];
    public newAppointment: Appointment = {
        id: 0,  // Ensure id is included for new appointments
        assignment: '',
        branch: '',
        vehicleOwner: {} as User,
        vehicleRegNo: '',
        status: 'OPEN',
        date: '',
        time: ''
    };

    public selectedAppointment: Appointment | null = null;
    public filteredAppointments: Appointment[] = [];
    public toastMessage: string | null = null;
    public usersList: User[] = [];
    public user: any = null;
    public errorMessageAssignment = '';
    public errorMessageVehicleRegNo = '';
    public errorMessageTime = '';
    public dealerList: Dealer[] = [];
    public dealerOpeningHours: string = '';

    constructor(
        private readonly appointmentService: AppointmentService,
        private readonly userService: UserService,
        private readonly modalService: NgbModal,
        private readonly dealerService: DealerService,
        protected readonly authService: AuthService) {
    }

    /**
     * Initializes the component by fetching appointments, users, and dealers.
     */
    public ngOnInit(): void {
        this.appointmentService.getAppointments().subscribe(appointments => {
            this.appointmentList = appointments;
            this.filterAppointments();
        });

        this.userService.getUsers().subscribe(users => {
            this.usersList = users;
        });

        this.dealerService.getDealers().subscribe(dealers => {
            this.dealerList = dealers;
            if (this.dealerList.length > 0) {
                this.newAppointment.branch = this.dealerList[0].city;
                this.updateOpeningHours();
            }
        });

        if (this.selectedAppointment && this.selectedAppointment.branch) {
            this.updateOpeningHours();
        }

        const now = new Date();
        this.newAppointment.date = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        this.newAppointment.time = this.formatTime(now); // Format as HH:mm
    }

    /**
     * Opens a modal window.
     * @param modal - The modal to be opened.
     */
    public open(modal: any): void {
        this.modalService.open(modal);
    }

    /**
     * Opens the edit modal for an appointment and prepares the selected appointment for editing.
     * @param modal - The modal to be opened.
     * @param appointment - The appointment to be edited.
     */
    public openEditModalAppointment(modal: any, appointment: Appointment) {
        this.selectedAppointment = {...appointment};
        this.updateOpeningHours();
        this.modalService.open(modal);
    }

    /**
     * Deletes an appointment based on its ID.
     * @param appointmentId - The ID of the appointment to be deleted.
     */
    public deleteAppointment(appointmentId: number): void {
        if (appointmentId) {
            this.appointmentList = this.appointmentList.filter(x => x.id !== appointmentId);
            this.filteredAppointments = this.filteredAppointments.filter(x => x.id !== appointmentId);

            this.appointmentService.deleteAppointment(appointmentId).subscribe({
                next: () => {
                    this.showToast('Appointment deleted successfully');
                },
                error: (err) => {
                    this.showToast('Error deleting appointment');
                    console.error('Delete appointment failed', err);
                }
            });
        } else {
            this.showToast('Invalid appointment ID');
        }
    }

    /**
     * Saves a new appointment after validating the inputs.
     * @param modal - The modal to be closed after saving the appointment.
     */
    public saveAppointment(modal: any): void {
        if (!isNotEmpty(this.newAppointment.assignment)) {
            this.errorMessageAssignment = "Auftrag darf nicht leer sein";
        } else {
            this.errorMessageAssignment = "";
        }

        if (!isValidVehicleRegNo(this.newAppointment.vehicleRegNo)) {
            this.errorMessageVehicleRegNo = "Kennzeichen ist nicht valide (Bsp.: \"M-XY 5678\", \"B-A 123\", \"HH-AB 1234\")";
        } else {
            this.errorMessageVehicleRegNo = "";
        }

        const selectedDealer = this.dealerList.find(x => x.city === this.newAppointment.branch);

        if (selectedDealer) {
            if (!isInOpeningTime(selectedDealer.openingTime, selectedDealer.closingTime, this.newAppointment.time)) {
                this.errorMessageTime = `Die Uhrzeit liegt nicht innerhalb der Öffnungszeiten. \n ${this.dealerOpeningHours}`;
            } else {
                this.errorMessageTime = "";
            }
        } else {
            return;
        }

        if (this.newAppointment.assignment && this.newAppointment.branch &&
            this.newAppointment.vehicleRegNo && this.newAppointment.status && this.newAppointment.date && this.newAppointment.time
            && isNotEmpty(this.newAppointment.assignment) && isValidVehicleRegNo(this.newAppointment.vehicleRegNo)
            && isInOpeningTime(selectedDealer.openingTime, selectedDealer.closingTime, this.newAppointment.time)) {

            const mailOfUser = this.authService.getMailFromJWT();
            this.userService.getUsers().subscribe(users => {
                // Fallback, wenn kein Benutzer gefunden wird
                const userFound = users.find(user => user.email === mailOfUser);
                this.newAppointment.vehicleOwner = userFound || {} as User;  // Sicherstellen, dass vehicleOwner immer ein User ist
                this.appointmentService.createAppointment(this.newAppointment).subscribe(savedAppointment => {
                    this.appointmentList.push(savedAppointment);

                    this.newAppointment = {
                        id: 0,  // ID für den neuen Termin
                        assignment: '',
                        branch: '',
                        vehicleOwner: {} as User,  // Sicherstellen, dass ein leerer User gesetzt wird
                        vehicleRegNo: '',
                        status: 'OPEN',
                        date: '',
                        time: ''
                    };
                    this.showToast('Appointment created successfully');
                    modal.close();
                    this.filteredAppointments.push(savedAppointment);
                });
            });
        }
    }

    /**
     * Updates an existing appointment after validating the inputs.
     * @param modal - The modal to be closed after updating the appointment.
     */
    public updateAppointment(modal: any): void {
        if (isNotEmpty(this.newAppointment.assignment)) {
            this.errorMessageAssignment = "Auftrag darf nicht leer sein";
        } else {
            this.errorMessageAssignment = "";
        }

        if (!isValidVehicleRegNo(this.newAppointment.vehicleRegNo)) {
            this.errorMessageVehicleRegNo = "Kennzeichen ist nicht valide (Bsp.: \"M-XY 5678\", \"B-A 123\", \"HH-AB 1234\")";
        } else {
            this.errorMessageVehicleRegNo = "";
        }

        const selectedDealer = this.dealerList.find(x => x.city === this.newAppointment.branch);

        if (selectedDealer) {
            if (!isInOpeningTime(selectedDealer.openingTime, selectedDealer.closingTime, this.newAppointment.time)) {
                this.errorMessageTime = `Die Uhrzeit liegt nicht innerhalb der Öffnungszeiten. \n ${this.dealerOpeningHours}`;
            } else {
                this.errorMessageTime = "";
            }
        } else {
            return;
        }

        if (this.selectedAppointment && this.selectedAppointment.id) {
            this.appointmentService.updateAppointment(this.selectedAppointment.id, this.selectedAppointment).subscribe(updatedAppointment => {

                this.selectedAppointment = updatedAppointment;

                const index = this.appointmentList.findIndex(app => app.id === updatedAppointment.id);
                if (index !== -1) {
                    this.appointmentList[index] = {...updatedAppointment};
                }

                const filteredIndex = this.filteredAppointments.findIndex(app => app.id === updatedAppointment.id);
                if (filteredIndex !== -1) {
                    this.filteredAppointments[filteredIndex] = {...updatedAppointment};
                }

                this.showToast('Appointment updated successfully');
                modal.close();
                this.selectedAppointment = null;
                window.location.reload();
            }, error => {
                this.showToast('Error updating appointment');
                console.error('Update appointment failed', error);
            });
        } else {
            this.showToast('Appointment not selected');
        }
    }

    /**
     * Closes the currently visible toast message.
     */
    public closeToast(): void {
        this.toastMessage = null;
    }

    /**
     * Converts appointment status codes to human-readable format.
     * @param status - The status of the appointment.
     * @returns The human-readable status.
     */
    public getStatusDisplay(status: string): string {
        const statusMap: { [key: string]: string } = {
            OPEN: 'Offen',
            IN_PROGRESS: 'In Bearbeitung',
            COMPLETED: 'Beendet'
        };
        return (statusMap)[status] || status;
    }

    /**
     * Formats the given date into a time string (HH:mm).
     * @param date - The date object to format.
     * @returns The formatted time string.
     */
    public formatTime(date: Date): string {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    /**
     * Updates the opening hours information based on the selected dealer's branch.
     */
    public updateOpeningHours() {
        const selectedDealer = this.dealerList.find(dealer => dealer.city === this.newAppointment.branch);
        this.dealerOpeningHours = selectedDealer
            ? `Öffnungszeiten: ${selectedDealer.openingTime} - ${selectedDealer.closingTime}`
            : 'Öffnungszeiten nicht verfügbar';
    }

    public updateOpeningHoursForUpdate() {
        const selectedDealer = this.dealerList.find(dealer => dealer.city === this.selectedAppointment?.branch);
        this.dealerOpeningHours = selectedDealer
            ? `Öffnungszeiten: ${selectedDealer.openingTime} - ${selectedDealer.closingTime}`
            : 'Öffnungszeiten nicht verfügbar';
    }

    /**
     * Filters the list of appointments to only include those belonging to the current user.
     */
    private filterAppointments(): void {
        const userEmail = this.authService.getMailFromJWT();
        this.filteredAppointments = this.appointmentList.filter(appointment => {
            return appointment.vehicleOwner.email === userEmail;
        });
    }

    /**
     * Displays a toast message and hides it after 5 seconds.
     * @param message - The message to display in the toast.
     */
    private showToast(message: string): void {
        this.toastMessage = message;
        setTimeout(() => this.closeToast(), 5000);
    }
}