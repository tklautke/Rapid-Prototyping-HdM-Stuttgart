import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserEntity} from './user.entity';
import {LoginDto, User} from 'interfaces';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) {
    }

    public async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    public async createUser(userData: User): Promise<User> {
        const newUser = this.userRepository.create(userData);
        return this.userRepository.save(newUser);
    }

    public async updateUser(id: number, userData: User): Promise<User> {
        await this.userRepository.update(id, userData);
        return this.userRepository.findOne({where: {id}});
    }

    public async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    /**
     * Login a user by checking email and password in plain text.
     * @param loginData - The login credentials (email and password).
     * @returns A JWT access token.
     */
    public async login(loginData: LoginDto): Promise<{ accessToken: string }> {
        const {email, password} = loginData;

        const user = await this.userRepository.findOne({where: {email}});

        if (!user || password !== user.password) {
            throw new Error('Invalid credentials');
        }

        const payload = {email: user.email, sub: user.id, isDealer: user.isDealer};
        const accessToken = this.jwtService.sign(payload);

        return {accessToken};
    }
}
