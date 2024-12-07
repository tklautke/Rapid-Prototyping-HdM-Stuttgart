import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {AppointmentEntity} from './appointment.entity';
import {UserEntity} from "../user/user.entity";

@Injectable()
export class AppointmentSeeder {
    constructor(
        @InjectRepository(AppointmentEntity)
        private appointmentRepository: Repository<AppointmentEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {
    }

    async seed() {
        const count = await this.appointmentRepository.count();
        if (count === 0) {
            // Fetch existing users to link to appointments
            const users = await this.userRepository.find();
            const user1 = users.find(user => user.email === 'john.doe@example.com');
            const user2 = users.find(user => user.email === 'alice.smith@example.com');
            const user3 = users.find(user => user.email === 'bob.brown@example.com');

            if (!user1 || !user2 || !user3) {
                console.log('Users must be seeded before seeding appointments.');
                return;
            }

            const appointments: Partial<AppointmentEntity>[] = [
                {
                    assignment: 'Oil Change',
                    branch: 'Berlin',
                    date: '2024-10-01',
                    time: '10:30',
                    status: 'In Bearbeitung',
                    vehicleOwner: user1,
                    vehicleRegNo: 'B-AB 1234',
                },
                {
                    assignment: 'Tire Change',
                    branch: 'Dortmund',
                    date: '2024-10-05',
                    time: '14:00',
                    status: 'Offen',
                    vehicleOwner: user2,
                    vehicleRegNo: 'M-XY 5678',
                },
                {
                    assignment: 'Inspection',
                    branch: 'Berlin',
                    date: '2024-09-30',
                    time: '09:00',
                    status: 'Beendet',
                    vehicleOwner: user3,
                    vehicleRegNo: 'C-DK 9101',
                },
            ];

            await this.appointmentRepository.save(appointments);
            console.log('Initial appointment data seeded');
        } else {
            console.log('Appointments already exist, skipping seeding');
        }
    }
}
