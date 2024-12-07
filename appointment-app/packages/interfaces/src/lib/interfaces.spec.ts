import {Appointment, Dealer, LoginDto, User} from './interfaces';


describe('DTO and Model Tests', () => {

    // Test the Dealer class
    describe('Dealer', () => {
        it('should create a Dealer instance with required properties', () => {
            const dealer = new Dealer();
            dealer.postalCode = 10115;
            dealer.street = 'Unter den Linden';
            dealer.houseNumber = 1;
            dealer.city = 'Berlin';
            dealer.openingTime = '08:00';
            dealer.closingTime = '18:00';

            expect(dealer).toBeInstanceOf(Dealer);
            expect(dealer.postalCode).toBe(10115);
            expect(dealer.street).toBe('Unter den Linden');
            expect(dealer.houseNumber).toBe(1);
            expect(dealer.city).toBe('Berlin');
            expect(dealer.openingTime).toBe('08:00');
            expect(dealer.closingTime).toBe('18:00');
        });
    });

    // Test the User class
    describe('User', () => {
        it('should create a User instance with required properties', () => {
            const user = new User();
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.email = 'john.doe@example.com';
            user.isDealer = true;
            user.password = 'StrongPassword123!';

            expect(user).toBeInstanceOf(User);
            expect(user.firstname).toBe('John');
            expect(user.lastname).toBe('Doe');
            expect(user.email).toBe('john.doe@example.com');
            expect(user.isDealer).toBe(true);
            expect(user.password).toBe('StrongPassword123!');
        });
    });

    // Test the LoginDto class
    describe('LoginDto', () => {
        it('should create a LoginDto instance with email and password', () => {
            const loginDto = new LoginDto();
            loginDto.email = 'john.doe@example.com';
            loginDto.password = 'StrongPassword123!';

            expect(loginDto).toBeInstanceOf(LoginDto);
            expect(loginDto.email).toBe('john.doe@example.com');
            expect(loginDto.password).toBe('StrongPassword123!');
        });
    });

    // Test the Appointment class
    describe('Appointment', () => {
        it('should create an Appointment instance with all required properties', () => {
            const user = new User();
            user.firstname = 'Jane';
            user.lastname = 'Smith';
            user.email = 'jane.smith@example.com';
            user.isDealer = false;
            user.password = 'SecurePassword123!';

            const appointment = new Appointment();
            appointment.assignment = 'Oil Change';
            appointment.branch = 'Berlin';
            appointment.vehicleOwner = user;
            appointment.vehicleRegNo = 'B-AB 1234';
            appointment.status = 'Scheduled';
            appointment.date = '2024-10-01';
            appointment.time = '10:30';

            expect(appointment).toBeInstanceOf(Appointment);
            expect(appointment.assignment).toBe('Oil Change');
            expect(appointment.branch).toBe('Berlin');
            expect(appointment.vehicleOwner).toBe(user);
            expect(appointment.vehicleRegNo).toBe('B-AB 1234');
            expect(appointment.status).toBe('Scheduled');
            expect(appointment.date).toBe('2024-10-01');
            expect(appointment.time).toBe('10:30');
        });
    });
});
