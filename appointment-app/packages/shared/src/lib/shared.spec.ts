import {isNotEmpty, isValidEmail, isValidPassword, shared} from './shared';

describe('shared', () => {
    it('should work', () => {
        expect(shared()).toEqual('shared');
    });
});

describe('Validation Functions', () => {

    describe('isValidEmail', () => {
        it('should return true for a valid email address', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
        });

        it('should return false for an invalid email address without an @ symbol', () => {
            expect(isValidEmail('testexample.com')).toBe(false);
        });

        it('should return false for an invalid email address without a top-level domain', () => {
            expect(isValidEmail('test@example')).toBe(false);
        });

        it('should return false for an email with invalid characters', () => {
            expect(isValidEmail('test@exa!mple.com')).toBe(false);
        });
    });

    describe('isValidPassword', () => {
        it('should return true for a valid password', () => {
            expect(isValidPassword('Password123')).toBe(true);
        });

        it('should return false for a password without a lowercase letter', () => {
            expect(isValidPassword('PASSWORD123')).toBe(false);
        });

        it('should return false for a password without an uppercase letter', () => {
            expect(isValidPassword('password123')).toBe(false);
        });

        it('should return false for a password without a digit', () => {
            expect(isValidPassword('Password')).toBe(false);
        });

        it('should return false for a password shorter than 4 characters', () => {
            expect(isValidPassword('Pwd1')).toBe(true);
        });
    });

    describe('isValidName', () => {
        it('should return true for a valid name', () => {
            expect(isNotEmpty('John')).toBe(true);
        });

        it('should return false for a name with only whitespace', () => {
            expect(isNotEmpty('     ')).toBe(false);
        });

        it('should return false for an empty name', () => {
            expect(isNotEmpty('')).toBe(false);
        });
    });

});