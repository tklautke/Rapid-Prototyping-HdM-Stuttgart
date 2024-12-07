import {AppointmentEntity} from './appointment.entity';
import {UserEntity} from '../user/user.entity';

describe('AppointmentEntity', () => {
    let appointment: AppointmentEntity;

    beforeEach(() => {
        appointment = new AppointmentEntity();
        appointment.id = 1;
        appointment.assignment = 'Test Assignment';
        appointment.branch = 'Test Branch';
        appointment.date = '2024-01-01';
        appointment.status = 'Scheduled';
        appointment.time = '10:00';
        appointment.vehicleOwner = new UserEntity();
        appointment.vehicleOwner.id = 1;
        appointment.vehicleRegNo = 'ABC-1234';
    });

    it('should have an id property', () => {
        expect(appointment).toHaveProperty('id');
    });

    it('should have an assignment property', () => {
        expect(appointment).toHaveProperty('assignment');
    });

    it('should have a branch property', () => {
        expect(appointment).toHaveProperty('branch');
    });

    it('should have a date property', () => {
        expect(appointment).toHaveProperty('date');
    });

    it('should have a status property', () => {
        expect(appointment).toHaveProperty('status');
    });

    it('should have a time property', () => {
        expect(appointment).toHaveProperty('time');
    });

    it('should have a vehicleOwner property', () => {
        expect(appointment).toHaveProperty('vehicleOwner');
    });

    it('should have a vehicleRegNo property', () => {
        expect(appointment).toHaveProperty('vehicleRegNo');
    });

    it('should have a ManyToOne relationship with UserEntity as vehicleOwner', () => {
        expect(appointment.vehicleOwner).toBeInstanceOf(UserEntity);
    });
});
