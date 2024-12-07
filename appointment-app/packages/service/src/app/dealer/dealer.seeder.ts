import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {DealerEntity} from './dealer.entity';

@Injectable()
export class DealerSeeder {
    constructor(
        @InjectRepository(DealerEntity)
        private dealerRepository: Repository<DealerEntity>,
    ) {
    }

    /**
     * Seeds the dealer data into the database if it is empty.
     * This method checks the current count of dealers in the database.
     * If no dealers exist, it creates a set of initial dealer data
     * and saves them to the database.
     * If dealers already exist, it skips the seeding process.
     */
    async seed() {
        const count = await this.dealerRepository.count();
        if (count === 0) {
            const dealers: DealerEntity[] = [
                {
                    city: 'Berlin',
                    postalCode: 10115,
                    street: 'Unter den Linden',
                    houseNumber: 1,
                    openingTime: '08:00',
                    closingTime: '18:00',
                    id: 0,
                },
                {
                    city: 'Munich',
                    postalCode: 80331,
                    street: 'Marienplatz',
                    houseNumber: 2,
                    openingTime: '09:00',
                    closingTime: '19:00',
                    id: 0,
                },
                {
                    city: 'Hamburg',
                    postalCode: 20095,
                    street: 'Jungfernstieg',
                    houseNumber: 3,
                    openingTime: '08:30',
                    closingTime: '17:30',
                    id: 0,
                },
            ];

            await this.dealerRepository.save(dealers);
            console.log('Initial dealer data seeded');
        } else {
            console.log('Dealer data already exists, skipping seeding');
        }
    }
}
