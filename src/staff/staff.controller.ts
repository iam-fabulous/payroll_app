import {
    Controller,
    Post,
    Body,
    Get,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseIntPipe,
    Param,
    Query,
}   from '@nestjs/common';
import { CreateStaffDto } from './dto/create_staff.dto';
import { StaffService } from './staff.service';
import { StaffMember } from './models/staff_member';
import { CalculateSalaryDto } from './dto/calculate_salary.dto';

@Controller('staff')
@UseInterceptors(ClassSerializerInterceptor)
export class StaffController {
    constructor(private readonly staffService: StaffService) {}

    @Post()
    createStaff(@Body() createStaffDto: CreateStaffDto) {
        return this.staffService.createStaff(createStaffDto);
    }

    @Get('findAllStaff')
    findAll() {
        return this.staffService.findAll();
    }

    @Get('salary')
    async getSalary(
        @Query() query: CalculateSalaryDto,
    ) {
        const dateAsString = query.currentDate || new Date().toISOString();
        const salary = await this.staffService.getSalary(query.staffId, dateAsString);

        return {
            staffId: query.staffId,
            salary: salary,
            asOf: dateAsString,
        }
    }
}