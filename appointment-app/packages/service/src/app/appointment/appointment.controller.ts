import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import {AppointmentService} from './appointment.service';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Appointment} from "interfaces";
import {AppointmentEntity} from "./appointment.entity";
import {isValidStatus, isValidVehicleRegNo} from "shared";

@ApiTags('appointments')
@Controller('appointment')
export class AppointmentController {
    constructor(private appointmentService: AppointmentService) {
    }

    /**
     * Retrieves all appointments.
     * @returns {Promise<Appointment[]>} A promise that resolves to an array of Appointment objects.
     */
    @Get()
    @ApiOperation({summary: 'Retrieve all appointments', description: 'Fetches all appointments from the database.'})
    @ApiResponse({status: 200, description: 'A list of all appointments.', type: [Appointment]})
    public async getData(): Promise<Appointment[]> {
        return this.appointmentService.getData();
    }

    /**
     * Creates a new appointment.
     * @param {Appointment} appointmentData - The appointment data provided in the request body.
     * @returns {Promise<Appointment>} A promise that resolves to the created Appointment object.
     * @throws {HttpException} Throws an error if the status or vehicle registration number is invalid.
     */
    @Post()
    @ApiOperation({
        summary: 'Create a new appointment',
        description: 'Creates a new appointment record in the database.'
    })
    @ApiResponse({status: 201, description: 'The appointment has been successfully created.', type: Appointment})
    @ApiResponse({
        status: 400,
        description: 'Invalid input data. Ensure that the status and vehicle registration number are valid.'
    })
    @ApiBody({description: 'The details of the new appointment to create', type: Appointment})
    public async createAppointment(
        @Body() appointmentData: Appointment
    ): Promise<Appointment> {
        if (!isValidStatus(appointmentData.status)) {
            throw new HttpException('Status is not valid', HttpStatus.BAD_REQUEST);
        }
        if (!isValidVehicleRegNo(appointmentData.vehicleRegNo)) {
            throw new HttpException('Vehicle registration number is not valid', HttpStatus.BAD_REQUEST);
        }

        return this.appointmentService.createAppointment(appointmentData as Partial<AppointmentEntity>);
    }

    /**
     * Updates an existing appointment.
     * @param {number} id - The ID of the appointment to update.
     * @param {Appointment} appointmentData - The updated appointment data.
     * @returns {Promise<Appointment>} A promise that resolves to the updated Appointment object.
     * @throws {HttpException} Throws an error if the status or vehicle registration number is invalid.
     */
    @Put(':id')
    @ApiOperation({summary: 'Update an appointment', description: 'Updates the details of an existing appointment.'})
    @ApiParam({name: 'id', type: 'integer', description: 'The ID of the appointment to update'})
    @ApiResponse({status: 200, description: 'The appointment has been successfully updated.', type: Appointment})
    @ApiResponse({
        status: 400,
        description: 'Invalid input data. Ensure that the status and vehicle registration number are valid.'
    })
    @ApiBody({description: 'The updated details of the appointment', type: Appointment})
    public async updateAppointment(
        @Param('id', ParseIntPipe) id: number,
        @Body() appointmentData: Appointment
    ): Promise<Appointment> {
        if (!isValidStatus(appointmentData.status)) {
            throw new HttpException('Status is not valid', HttpStatus.BAD_REQUEST);
        }
        if (!isValidVehicleRegNo(appointmentData.vehicleRegNo)) {
            throw new HttpException('Vehicle registration number is not valid', HttpStatus.BAD_REQUEST);
        }

        return this.appointmentService.updateAppointment(id, appointmentData as Partial<AppointmentEntity>);
    }

    /**
     * Deletes an appointment.
     * @param {number} id - The ID of the appointment to delete.
     * @returns {Promise<void>} A promise that resolves when the appointment has been successfully deleted.
     */
    @Delete(':id')
    @ApiOperation({summary: 'Delete an appointment', description: 'Deletes an appointment by its ID.'})
    @ApiParam({name: 'id', type: 'integer', description: 'The ID of the appointment to delete'})
    @ApiResponse({status: 204, description: 'The appointment has been successfully deleted.'})
    public async deleteAppointment(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.appointmentService.deleteAppointment(id);
    }
}
