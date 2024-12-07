import {Module, OnModuleInit} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {AppointmentController} from './appointment/appointment.controller';
import {AppointmentService} from './appointment/appointment.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppointmentEntity} from './appointment/appointment.entity';
import {AppointmentSeeder} from './appointment/appointment.seeder';
import {DealerEntity} from './dealer/dealer.entity';
import {DealerSeeder} from './dealer/dealer.seeder';
import {DealerController} from './dealer/dealer.controller';
import {DealerService} from './dealer/dealer.service';
import {UserEntity} from './user/user.entity';
import {UserController} from './user/user.controller';
import {UserService} from './user/user.service';
import {UserSeeder} from './user/user.seeder';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'veryhard123',
            database: 'dev',
            entities: [AppointmentEntity, DealerEntity, UserEntity],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([AppointmentEntity, DealerEntity, UserEntity]),

        JwtModule.register({
            secret: '123veryhard',
            signOptions: {expiresIn: '60m'},
        }),
    ],
    controllers: [AppointmentController, DealerController, UserController],
    providers: [AppointmentService, AppointmentSeeder, DealerSeeder, DealerService, UserService, UserSeeder],
})
export class AppModule implements OnModuleInit {
    constructor(
        private readonly appointmentSeeder: AppointmentSeeder,
        private readonly dealerSeeder: DealerSeeder,
        private readonly userSeeder: UserSeeder,
    ) {
    }

    async onModuleInit() {
        await this.userSeeder.seed();
        await this.appointmentSeeder.seed();
        await this.dealerSeeder.seed();
    }
}
