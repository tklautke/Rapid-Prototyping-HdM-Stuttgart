import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/user.entity";

@Entity({
    name: 'appointments',
    schema: 'public'
})
export class AppointmentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'assignment'})
    assignment: string;

    @Column({name: 'branch'})
    branch: string;

    @Column({name: 'date'})
    date: string;

    @Column({name: 'status'})
    status: string;

    @Column({name: 'time'})
    time: string;

    @ManyToOne(() => UserEntity, {nullable: false})
    @JoinColumn({name: 'vehicleowner_id'})
    vehicleOwner: UserEntity;

    @Column({name: 'vehicleregno'})
    vehicleRegNo: string;
}
