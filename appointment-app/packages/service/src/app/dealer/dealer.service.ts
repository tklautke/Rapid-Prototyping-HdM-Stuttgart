import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {DealerEntity} from './dealer.entity';
import {Dealer} from 'interfaces';

@Injectable()
export class DealerService {
    constructor(
        @InjectRepository(DealerEntity)
        private dealerRepository: Repository<DealerEntity>,
    ) {
    }

    /**
     * Retrieves all dealers from the database.
     * @returns A promise that resolves to an array of Dealer objects.
     */
    public async getAllDealers(): Promise<Dealer[]> {
        return this.dealerRepository.find();
    }

    /**
     * Creates a new dealer and saves it to the database.
     * @param dealerData - The dealer data to be created.
     * @returns A promise that resolves to the created Dealer object.
     */
    public async createDealer(dealerData: Dealer): Promise<Dealer> {
        const newDealer = this.dealerRepository.create(dealerData);
        return this.dealerRepository.save(newDealer);
    }

    /**
     * Updates an existing dealer by ID with the provided data.
     * @param id - The ID of the dealer to be updated.
     * @param dealerData - The updated dealer data.
     * @returns A promise that resolves to the updated Dealer object.
     */
    public async updateDealer(id: number, dealerData: Dealer): Promise<Dealer> {
        await this.dealerRepository.update(id, dealerData);
        return this.dealerRepository.findOne({where: {id}});
    }

    /**
     * Deletes a dealer by ID from the database.
     * @param id - The ID of the dealer to be deleted.
     * @returns A promise that resolves to void.
     */
    public async deleteDealer(id: number): Promise<void> {
        await this.dealerRepository.delete(id);
    }
}
