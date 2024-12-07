import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {Dealer} from "interfaces";
import {DealerService} from "../dealer.service";
import {isNotEmpty, isNotEmptyNumber, isOpeningtimeBeforeClosingtime, isValidGermanPostcode} from "shared";

@Component({
    selector: 'app-dealer-detail-view',
    standalone: true,
    imports: [CommonModule, NgbInputDatepicker, FormsModule],
    templateUrl: './dealer-detail-view.component.html',
    styleUrls: ['./dealer-detail-view.component.scss'],
})
export class DealerDetailViewComponent implements OnInit {
    public dealerList: Dealer[] = [];
    public newDealer: Dealer = {
        postalCode: 0,
        street: '',
        houseNumber: 0,
        city: '',
        openingTime: '',
        closingTime: ''
    };

    public selectedDealer: Dealer | null = null;
    public toastMessage: string | null = null;
    public errorMessagePostcode = '';
    public errorMessageStreet = '';
    public errorMessageHouseNr = '';
    public errorMessageCity = '';
    public errorMessageOpeningtime = '';

    constructor(private readonly dealerService: DealerService,
                private readonly modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.dealerService.getDealers().subscribe(dealers => {
            this.dealerList = dealers;
        })
    }

    public open(modal: any): void {
        this.modalService.open(modal);
    }

    public openEditModalDealer(modal: any, dealer: Dealer): void {
        this.selectedDealer = {...dealer};  // Clone the selected dealer for editing
        this.modalService.open(modal);
    }

    public deleteDealer(dealerId: number | undefined): void {
        if (dealerId !== undefined) {
            this.dealerList = this.dealerList.filter(x => x.id !== dealerId);
            this.dealerService.deleteDealer(dealerId).subscribe(() => {
                this.showToast('Dealer deleted successfully');
            });
        }
    }

    public saveDealer(modal: any): void {

        if (!isValidGermanPostcode(this.newDealer.postalCode)) {
            this.errorMessagePostcode = "Das ist keine valide deutsche Postleitzahl";
        } else {
            this.errorMessagePostcode = "";
        }

        if (!isNotEmpty(this.newDealer.street)) {
            this.errorMessageStreet = "Die Straße darf nicht leer sein";
        } else {
            this.errorMessageStreet = "";
        }

        if (!isNotEmptyNumber(this.newDealer.houseNumber)) {
            this.errorMessageHouseNr = "Die Hausnummer darf nicht leer sein";
        } else {
            this.errorMessageHouseNr = "";
        }

        if (!isNotEmpty(this.newDealer.city)) {
            this.errorMessageCity = "Die Stadt darf nicht leer sein";
        } else {
            this.errorMessageCity = "";
        }

        if (!isOpeningtimeBeforeClosingtime(this.newDealer.openingTime, this.newDealer.closingTime)) {
            this.errorMessageOpeningtime = "Die Öffnungszeit muss vor der Schließzeit liegen";
        } else {
            this.errorMessageOpeningtime = "";
        }

        if (this.newDealer.postalCode && this.newDealer.street &&
            this.newDealer.houseNumber && this.newDealer.city &&
            this.newDealer.openingTime && this.newDealer.closingTime
            && isValidGermanPostcode(this.newDealer.postalCode)
            && isNotEmpty(this.newDealer.street)
            && isNotEmptyNumber(this.newDealer.houseNumber)
            && isNotEmpty(this.newDealer.city)
            && isOpeningtimeBeforeClosingtime(this.newDealer.openingTime, this.newDealer.closingTime)) {

            this.dealerService.createDealer(this.newDealer).subscribe(savedDealer => {
                this.dealerList.push(savedDealer);

                this.newDealer = {
                    postalCode: 0,
                    street: '',
                    houseNumber: 0,
                    city: '',
                    openingTime: '',
                    closingTime: '',
                };

                this.showToast('Dealer created successfully');
                modal.close();
            });
        }
    }

    public updateDealer(modal: any): void {
        if (this.selectedDealer) {
            if (!isValidGermanPostcode(this.selectedDealer.postalCode)) {
                this.errorMessagePostcode = "Das ist keine valide deutsche Postleitzahl";
            } else {
                this.errorMessagePostcode = "";
            }

            if (!isNotEmpty(this.selectedDealer.street)) {
                this.errorMessageStreet = "Die Straße darf nicht leer sein";
            } else {
                this.errorMessageStreet = "";
            }

            if (!isNotEmptyNumber(this.selectedDealer.houseNumber)) {
                this.errorMessageHouseNr = "Die Hausnummer darf nicht leer sein";
            } else {
                this.errorMessageHouseNr = "";
            }

            if (!isNotEmpty(this.selectedDealer.city)) {
                this.errorMessageCity = "Die Stadt darf nicht leer sein";
            } else {
                this.errorMessageCity = "";
            }

            if (!isOpeningtimeBeforeClosingtime(this.selectedDealer.openingTime, this.selectedDealer.closingTime)) {
                this.errorMessageOpeningtime = "Die Öffnungszeit muss vor der Schließzeit liegen";
            } else {
                this.errorMessageOpeningtime = "";
            }

            // Überprüfen, ob alle Felder gültig sind
            if (this.selectedDealer.postalCode && this.selectedDealer.street &&
                this.selectedDealer.houseNumber && this.selectedDealer.city &&
                this.selectedDealer.openingTime && this.selectedDealer.closingTime &&
                isValidGermanPostcode(this.selectedDealer.postalCode) &&
                isNotEmpty(this.selectedDealer.street) &&
                isNotEmptyNumber(this.selectedDealer.houseNumber) &&
                isNotEmpty(this.selectedDealer.city) &&
                isOpeningtimeBeforeClosingtime(this.selectedDealer.openingTime, this.selectedDealer.closingTime)) {

                this.dealerService.updateDealer(this.selectedDealer.id, this.selectedDealer).subscribe(updatedDealer => {
                    const index = this.dealerList.findIndex(x => x.id === updatedDealer.id);
                    if (index !== -1) {
                        this.dealerList[index] = updatedDealer;
                    }

                    this.showToast('Händler erfolgreich aktualisiert');
                    modal.close();
                    this.selectedDealer = null; // Auswahl zurücksetzen
                });
            }
        }
    }


    public closeToast(): void {
        this.toastMessage = null;
    }

    private showToast(message: string): void {
        this.toastMessage = message;
        setTimeout(() => this.closeToast(), 5000);
    }

}