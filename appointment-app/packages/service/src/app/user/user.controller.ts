import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import {UserService} from './user.service';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {LoginDto, User} from 'interfaces';
import {isNotEmpty, isValidEmail, isValidPassword} from "shared";

@ApiTags('users')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
    }

    /**
     * Retrieves all users from the service.
     * @returns A promise that resolves to an array of User objects.
     */
    @Get()
    @ApiOperation({summary: 'Retrieve all users', description: 'Fetches all users from the database.'})
    @ApiResponse({status: 200, description: 'Successfully retrieved the list of all users.', type: [User]})
    public async getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    /**
     * Creates a new user using the provided user data.
     * @param userData - The user data for creating a new user.
     * @returns A promise that resolves to the created User object.
     * @throws {HttpException} Throws an error if the input data is invalid.
     */
    @Post()
    @ApiOperation({summary: 'Create a new user', description: 'Creates a new user with the provided user data.'})
    @ApiResponse({status: 201, description: 'User has been successfully created.', type: User})
    @ApiResponse({status: 400, description: 'Invalid input data.'})
    @ApiBody({description: 'User data for the new user', type: User})
    public async createUser(@Body() userData: User): Promise<User> {
        // Validate input data
        if (!isNotEmpty(userData.firstname)) {
            throw new HttpException('First name cannot be empty', HttpStatus.BAD_REQUEST);
        }

        if (!isNotEmpty(userData.lastname)) {
            throw new HttpException('Last name cannot be empty', HttpStatus.BAD_REQUEST);
        }

        if (!isValidEmail(userData.email)) {
            throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
        }

        if (!isValidPassword(userData.password)) {
            throw new HttpException(
                'Password must be at least 4 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
                HttpStatus.BAD_REQUEST,
            );
        }

        return this.userService.createUser(userData);
    }

    /**
     * Updates an existing user with the specified ID using the provided data.
     * @param id - The ID of the user to update.
     * @param userData - The updated user data.
     * @returns A promise that resolves to the updated User object.
     * @throws {HttpException} Throws an error if the user is not found or data is invalid.
     */
    @Put(':id')
    @ApiOperation({summary: 'Update an existing user', description: 'Updates user details for the specified user ID.'})
    @ApiParam({name: 'id', type: 'integer', description: 'The ID of the user to update'})
    @ApiResponse({status: 200, description: 'User has been successfully updated.', type: User})
    @ApiResponse({status: 400, description: 'Invalid input data.'})
    @ApiResponse({status: 404, description: 'User not found.'})
    @ApiBody({description: 'Updated user data', type: User})
    public async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() userData: User,
    ): Promise<User> {
        // Validate input data
        if (!isNotEmpty(userData.firstname)) {
            throw new HttpException('First name cannot be empty', HttpStatus.BAD_REQUEST);
        }

        if (!isNotEmpty(userData.lastname)) {
            throw new HttpException('Last name cannot be empty', HttpStatus.BAD_REQUEST);
        }

        if (!isValidEmail(userData.email)) {
            throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
        }

        if (!isValidPassword(userData.password)) {
            throw new HttpException(
                'Password must be at least 4 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
                HttpStatus.BAD_REQUEST,
            );
        }

        const updatedUser = await this.userService.updateUser(id, userData);
        if (!updatedUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return updatedUser;
    }

    /**
     * Deletes a user with the specified ID.
     * @param id - The ID of the user to delete.
     * @returns A promise that resolves to void.
     * @throws {HttpException} Throws an error if the user is not found.
     */
    @Delete(':id')
    @ApiOperation({summary: 'Delete a user', description: 'Deletes a user by the specified ID.'})
    @ApiParam({name: 'id', type: 'integer', description: 'The ID of the user to delete'})
    @ApiResponse({status: 204, description: 'User has been successfully deleted.'})
    @ApiResponse({status: 404, description: 'User not found.'})
    public async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.userService.deleteUser(id);
    }

    /**
     * Handles user login with email and password validation.
     * @param loginData - The login data containing email and password.
     * @returns A promise that resolves to an access token if login is successful.
     * @throws {HttpException} Throws an error if the login credentials are invalid.
     */
    @Post('login')
    @ApiOperation({summary: 'User login', description: 'Authenticates a user and returns an access token.'})
    @ApiResponse({status: 200, description: 'User successfully logged in.'})
    @ApiResponse({status: 401, description: 'Invalid credentials.'})
    @ApiBody({description: 'Login data including email and password', type: LoginDto})
    public async login(@Body() loginData: LoginDto): Promise<{ accessToken: string }> {
        if (!isValidEmail(loginData.email)) {
            throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
        }

        if (!isNotEmpty(loginData.password)) {
            throw new HttpException('Password cannot be empty', HttpStatus.BAD_REQUEST);
        }

        return this.userService.login(loginData);
    }
}
