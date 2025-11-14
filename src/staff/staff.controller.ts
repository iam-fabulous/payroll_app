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

@Controller('staff')
@UseInterceptors(ClassSerializerInterceptor)
export class StaffController {
    constructor(private readonly staffService: StaffService) {}

    @Post()
    createStaff(@Body() createStaffDto: CreateStaffDto) {
        return this.staffService.createStaff(createStaffDto);
    }

    @Get()
    findAll(@Query('name') name?: string) {
        return this.staffService.findAll(name);
    }

    @Get('salary')
    async getSalary(
        @Query() query: CalculateSalaryDto,
    ) {
        const dateAsString = query.currentDate || new Date().toISOString();
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

    @Patch(':staffId/assign-supervisor/:supervisorId')
    async assignSupervisor(
        @Body() updateSupervisorDto: UpdateSupervisorDto
    ) {
        return this.staffService.assignSupervisor(
            updateSupervisorDto.staffId,
            updateSupervisorDto.supervisorId,
        );
    }
}