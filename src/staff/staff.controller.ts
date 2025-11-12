import {
    Controller,
    Post,
    Body,
    Get,
    UseInterceptors,
    ClassSerializerInterceptor,
}   from '@nestjs/common';
import { CreateStaffDto } from './dto/create_staff.dto';
import { StaffService } from './staff.service';
import { StaffMember } from './models/staff_member';

@Controller('staff')
@UseInterceptors(ClassSerializerInterceptor)
export class StaffController {
    constructor(private readonly staffService: StaffService) {}

    @Post('createStaff')
    createStaff(@Body() createStaffDto: CreateStaffDto) {
        return this.staffService.createStaff(createStaffDto);
    }

    @Get('findAllStaff')
    findAll() {
        return this.staffService.findAll();
    }
}