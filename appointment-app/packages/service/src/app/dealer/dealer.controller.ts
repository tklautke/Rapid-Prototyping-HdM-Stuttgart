import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import {DealerService} from './dealer.service';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Dealer} from 'interfaces';
import {isNotEmpty, isNotEmptyNumber, isOpeningtimeBeforeClosingtime, isValidGermanPostcode} from "shared";

@ApiTags('dealers')
@Controller('dealer')
export class DealerController {
    constructor(private dealerService: DealerService) {
    }

    @Get()
    @ApiOperation({summary: 'Retrieve all dealers'})
    @ApiResponse({status: 200, description: 'A list of all dealers.', type: [Dealer]})
    public async getAllDealers(): Promise<Dealer[]> {
        return this.dealerService.getAllDealers();
    }

    @Post()
    @ApiOperation({summary: 'Create a new dealer'})
    @ApiResponse({status: 201, description: 'The dealer has been successfully created.', type: Dealer})
    @ApiResponse({status: 400, description: 'Invalid input data.'})
    @ApiBody({description: 'Dealer data required to create a new dealer', type: Dealer})
    public async createDealer(
        @Body() dealerData: Dealer
    ): Promise<Dealer> {
        if (!isValidGermanPostcode(dealerData.postalCode)) {
            throw new HttpException('Invalid postcode', HttpStatus.BAD_REQUEST);
        }

        if (!isNotEmpty(dealerData.street)) {
            throw new HttpException('Invalid street', HttpStatus.BAD_REQUEST);
        }

        if (!isNotEmptyNumber(dealerData.houseNumber)) {
            throw new HttpException('Invalid houseNumber', HttpStatus.BAD_REQUEST);
        }

        if (!isNotEmpty(dealerData.street)) {
            throw new HttpException('Invalid street', HttpStatus.BAD_REQUEST);
        }

        if (!isOpeningtimeBeforeClosingtime(dealerData.openingTime, dealerData.closingTime)) {
            throw new HttpException('closingtime is before openingtime', HttpStatus.BAD_REQUEST);
        }

        return this.dealerService.createDealer(dealerData);
    }

    @Put(':id')
    @ApiOperation({summary: 'Update an existing dealer'})
    @ApiParam({name: 'id', type: 'integer', description: 'The ID of the dealer to update'})
    @ApiResponse({status: 200, description: 'The dealer has been successfully updated.', type: Dealer})
    @ApiResponse({status: 400, description: 'Invalid input data.'})
    @ApiResponse({status: 404, description: 'Dealer with the specified ID not found.'})
    @ApiBody({description: 'Updated dealer data', type: Dealer})
    public async updateDealer(
        @Param('id', ParseIntPipe) id: number,
        @Body() dealerData: Dealer
    ): Promise<Dealer> {
        if (!isValidGermanPostcode(dealerData.postalCode)) {
            throw new HttpException('Invalid postcode', HttpStatus.BAD_REQUEST);
        }

        if (!isNotEmpty(dealerData.street)) {
            throw new HttpException('Invalid street', HttpStatus.BAD_REQUEST);
        }

        if (!isNotEmptyNumber(dealerData.houseNumber)) {
            throw new HttpException('Invalid houseNumber', HttpStatus.BAD_REQUEST);
        }

        if (!isNotEmpty(dealerData.street)) {
            throw new HttpException('Invalid street', HttpStatus.BAD_REQUEST);
        }

        if (!isOpeningtimeBeforeClosingtime(dealerData.openingTime, dealerData.closingTime)) {
            throw new HttpException('closingtime is before openingtime', HttpStatus.BAD_REQUEST);
        }

        return this.dealerService.updateDealer(id, dealerData);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Delete a dealer'})
    @ApiParam({name: 'id', type: 'integer', description: 'The ID of the dealer to delete'})
    @ApiResponse({status: 204, description: 'The dealer has been successfully deleted.'})
    @ApiResponse({status: 404, description: 'Dealer with the specified ID not found.'})
    public async deleteDealer(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.dealerService.deleteDealer(id);
    }
}
