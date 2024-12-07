import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Dealer} from "interfaces";

/**
 * Represents a dealer entity in the database.
 * This entity is mapped to the 'dealer' table in the 'public' schema.
 */
@Entity({
    name: 'dealer',
    schema: 'public'
})
export class DealerEntity implements Dealer {
    /**
     * The unique identifier for the dealer.
     * This column is auto-generated and serves as the primary key for the entity.
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * The city where the dealer is located.
     * For example, this could be 'Berlin' or 'Munich'.
     */
    @Column({name: 'city'})
    city: string;

    /**
     * The postal code (PLZ) of the dealer location.
     * This is typically a number, for example, 10115 for Berlin.
     */
    @Column({name: 'postalcode'})
    postalCode: number;

    /**
     * The street where the dealer is located.
     * For example, 'Unter den Linden'.
     */
    @Column({name: 'street'})
    street: string;

    /**
     * The house number of the dealer location.
     * For example, '15' or '27B'.
     */
    @Column({name: 'housenumber'})
    houseNumber: number;

    /**
     * The opening time of the dealer in 24-hour format.
     * For example, '08:00' for 8 AM.
     */
    @Column({name: 'openingtime'})
    openingTime: string;

    /**
     * The closing time of the dealer in 24-hour format.
     * For example, '18:00' for 6 PM.
     */
    @Column({name: 'closingtime'})
    closingTime: string;
}
