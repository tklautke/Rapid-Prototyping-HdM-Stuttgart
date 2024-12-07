import {Test, TestingModule} from '@nestjs/testing';
import {AppointmentSeeder} from './appointment.seeder';
import {Repository} from 'typeorm';
import {AppointmentEntity} from './appointment.entity';
import {UserEntity} from '../user/user.entity';
import {getRepositoryToken} from '@nestjs/typeorm';

describe('AppointmentSeeder', () => {
    let seeder: AppointmentSeeder;
    let appointmentRepository: jest.Mocked<Repository<AppointmentEntity>>;
    let userRepository: jest.Mocked<Repository<UserEntity>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppointmentSeeder,
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

        seeder = module.get<AppointmentSeeder>(AppointmentSeeder);
        appointmentRepository = module.get(getRepositoryToken(AppointmentEntity));
        userRepository = module.get(getRepositoryToken(UserEntity));
    });

    it('should seed appointments if none exist', async () => {
        appointmentRepository.count = jest.fn().mockResolvedValue(0);
        userRepository.find = jest.fn().mockResolvedValue([
            {email: 'john.doe@example.com'} as UserEntity,
            {email: 'alice.smith@example.com'} as UserEntity,
            {email: 'bob.brown@example.com'} as UserEntity,
        ]);
        appointmentRepository.save = jest.fn().mockResolvedValue([]);

        await seeder.seed();

        expect(appointmentRepository.count).toHaveBeenCalled();
        expect(userRepository.find).toHaveBeenCalled();
        expect(appointmentRepository.save).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({assignment: 'Oil Change'}),
            expect.objectContaining({assignment: 'Tire Change'}),
            expect.objectContaining({assignment: 'Inspection'}),
        ]));
    });
});
