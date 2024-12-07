import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {AppointmentEntity} from "../appointment/appointment.entity";

@Entity({name: 'user', schema: 'public'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'firstname'})
    firstname: string;

    @Column({name: 'lastname'})
    lastname: string;

    @Column({name: 'email'})
    email: string;

    @Column({name: 'isdealer'})
    isDealer: boolean;

    @Column({name: 'password'})
    password: string;

    @OneToMany(() => AppointmentEntity, (appointment) => appointment.vehicleOwner)
    appointments: AppointmentEntity[];
}
