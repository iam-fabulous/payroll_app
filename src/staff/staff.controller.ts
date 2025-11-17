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
    Patch,
}   from '@nestjs/common';
import { CreateStaffDto } from './dto/create_staff.dto';
import { UpdateSupervisorDto } from './dto/update_supervisor.dto';
import { StaffService } from './staff.service';
import { StaffMember } from './models/staff_member';
import { CalculateSalaryDto } from './dto/calculate_salary.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('staff')
@Controller('staff')
@UseInterceptors(ClassSerializerInterceptor)
export class StaffController {
    constructor(private readonly staffService: StaffService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new staff member' })
    @ApiResponse({ status: 201, description: 'The staff member has been successfully created.', type: StaffMember })
    createStaff(@Body() createStaffDto: CreateStaffDto) {
        return this.staffService.createStaff(createStaffDto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all staff members, optionally filtered by name' })
    @ApiQuery({ name: 'name', required: false, description: 'filter by name' })
    @ApiResponse({ status: 200, description: 'List of staff members', type: [StaffMember] })
    findAll(@Query('name') name?: string) {
        return this.staffService.findAll(name);
    }

    @Get('salary')
    @ApiOperation({ summary: 'Calculate the salary of a staff member as of a specific date' })
    @ApiResponse({ status: 200, description: 'The calculated salary details' })
    async getSalary(
        @Query() query: CalculateSalaryDto,
    ) {
        const dateAsString = query.currentDate;
        const salary = await this.staffService.getSalary(query.staffId, dateAsString);
        const staff = await this.staffService.findStaffById(query.staffId);

        return {
            staffId: query.staffId,
            staffName: staff ? staff.name : 'Unknown',
            salary: salary,
            asOf: dateAsString,
        }
    }

    @Get('total-salary')
    @ApiOperation({ summary: 'Calculate the total salary expenditure for all staff as of a specific date' })
    @ApiResponse({ status: 200, description: 'The total salary expenditure details' })
    async getTotalSalary(
        @Query('atDate') atDate: string,
    ){
        const dateAsString = atDate || new Date().toISOString();
        const totalSalary = await this.staffService.getTotalSalary(dateAsString);
        return {
            totalSalaryExpenditure: totalSalary,
            asOf: dateAsString,
        }
    }

    @Patch('assign-supervisor')
    @ApiOperation({ summary: 'Assign or update the supervisor for a staff member' })
    @ApiResponse({ status: 200, description: 'The supervisor has been successfully assigned/updated.' })
    async assignSupervisor(
        @Body() updateSupervisorDto: UpdateSupervisorDto
    ) {
        return this.staffService.assignSupervisor(
            updateSupervisorDto.staffId,
            updateSupervisorDto.supervisorId,
        );
    }
}