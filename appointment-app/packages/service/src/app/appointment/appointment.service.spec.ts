import {Test, TestingModule} from '@nestjs/testing';
import {AppointmentService} from './appointment.service';
import {Repository} from 'typeorm';
import {AppointmentEntity} from './appointment.entity';
import {UserEntity} from '../user/user.entity';
import {getRepositoryToken} from '@nestjs/typeorm';

describe('AppointmentService', () => {
    let service: AppointmentService;
    let appointmentsRepo: Repository<AppointmentEntity>;
    let userRepo: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppointmentService,
                {
                    provide: getRepositoryToken(AppointmentEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(UserEntity),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<AppointmentService>(AppointmentService);
        appointmentsRepo = module.get<Repository<AppointmentEntity>>(getRepositoryToken(AppointmentEntity));
        userRepo = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getData', () => {
        it('should retrieve all appointments with relations', async () => {
            const mockAppointments = [{id: 1}, {id: 2}] as AppointmentEntity[];
            jest.spyOn(appointmentsRepo, 'find').mockResolvedValue(mockAppointments);

            const result = await service.getData();

            expect(result).toEqual(mockAppointments);
            expect(appointmentsRepo.find).toHaveBeenCalledWith({relations: ['vehicleOwner']});
        });
    });

    describe('createAppointment', () => {
        it('should throw an error if vehicleOwner is not provided', async () => {
            const appointmentData = {};

            await expect(service.createAppointment(appointmentData)).rejects.toThrow('Vehicle owner must be provided with a valid ID');
        });

        it('should throw an error if the vehicleOwner is not found', async () => {
            const appointmentData = {vehicleOwner: {id: 1}} as Partial<AppointmentEntity>;
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

            await expect(service.createAppointment(appointmentData)).rejects.toThrow('User with ID 1 not found');
        });

        it('should create and return a new appointment', async () => {
            const appointmentData = {vehicleOwner: {id: 1}} as Partial<AppointmentEntity>;
            const mockUser = {id: 1} as UserEntity;
            const mockAppointment = {id: 1, ...appointmentData} as AppointmentEntity;

            jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(appointmentsRepo, 'create').mockReturnValue(mockAppointment);
            jest.spyOn(appointmentsRepo, 'save').mockResolvedValue(mockAppointment);

            const result = await service.createAppointment(appointmentData);

            expect(result).toEqual(mockAppointment);
            expect(appointmentsRepo.create).toHaveBeenCalledWith({...appointmentData, vehicleOwner: mockUser});
            expect(appointmentsRepo.save).toHaveBeenCalledWith(mockAppointment);
        });
    });

    describe('updateAppointment', () => {
        it('should update and return the updated appointment', async () => {
            const appointmentId = 1;
            const appointmentData = {title: 'Updated Title'} as Partial<AppointmentEntity>;
            const updatedAppointment = {id: appointmentId, ...appointmentData} as AppointmentEntity;

            jest.spyOn(appointmentsRepo, 'update').mockResolvedValue(undefined);
            jest.spyOn(appointmentsRepo, 'findOneBy').mockResolvedValue(updatedAppointment);

            const result = await service.updateAppointment(appointmentId, appointmentData);

            expect(result).toEqual(updatedAppointment);
            expect(appointmentsRepo.update).toHaveBeenCalledWith(appointmentId, appointmentData);
            expect(appointmentsRepo.findOneBy).toHaveBeenCalledWith({id: appointmentId});
        });
    });

    describe('deleteAppointment', () => {
        it('should delete the appointment', async () => {
            const appointmentId = 1;
            jest.spyOn(appointmentsRepo, 'delete').mockResolvedValue(undefined);

            await service.deleteAppointment(appointmentId);

            expect(appointmentsRepo.delete).toHaveBeenCalledWith(appointmentId);
        });
    });
});
