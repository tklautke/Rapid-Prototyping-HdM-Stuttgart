import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserEntity} from './user.entity';

@Injectable()
export class UserSeeder {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {
    }

    /**
     * Seeds the user data into the database if it is empty.
     * This method checks the current count of users in the database.
     * If no users exist, it creates a set of initial user data
     * and saves them to the database.
     * If users already exist, it skips the seeding process.
     */
    async seed() {
        const count = await this.userRepository.count();
        if (count === 0) {
            const users: UserEntity[] = [
                {
                    firstname: 'John',
                    lastname: 'Doe',
                    email: 'john.doe@example.com',
                    password: 'StrongPassword123!',
                    isDealer: false,
                    id: 0,
                    appointments: []
                },
                {
                    firstname: 'Alice',
                    lastname: 'Smith',
                    email: 'alice.smith@example.com',
                    password: 'SecurePassword456!',
                    isDealer: true,
                    id: 0,
                    appointments: []
                },
                {
                    firstname: 'Bob',
                    lastname: 'Brown',
                    email: 'bob.brown@example.com',
                    password: 'Pass1234!',
                    isDealer: false,
                    id: 0,
                    appointments: []
                },
            ];

            await this.userRepository.save(users);
            console.log('Initial user data seeded');
        } else {
            console.log('User data already exists, skipping seeding');
        }
    }
}
