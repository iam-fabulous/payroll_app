import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { StaffMember } from './models/staff_member';
import { CreateStaffDto } from './dto/create_staff.dto'; // We'll create this next
import { Employee } from './models/employee';
import { Manager } from './models/manager';
import { Sales } from './models/sales';

@Injectable()
export class StaffService {
    constructor(
        @InjectRepository(StaffMember)
        private staffRepository: TreeRepository<StaffMember>,
    ) {}

    // Create a new Staff Member
    async createStaff(createStaffDto: CreateStaffDto): Promise<StaffMember> {
        let staff: StaffMember;
        switch (createStaffDto.type) {
            case 'EMPLOYEE':
                staff = new Employee();
                break;
            case 'MANAGER':
                staff = new Manager();
                break;
            case 'SALES':
                staff = new Sales();
                break;
            default:
                throw new NotFoundException('Invalid staff type');
        }

        staff.name = createStaffDto.name;
        staff.dateJoined = new Date(createStaffDto.dateJoined);
        staff.baseSalary = createStaffDto.baseSalary;

        if (createStaffDto.supervisorId) {
            const supervisor = await this.staffRepository.findOne({
                where: { id: createStaffDto.supervisorId },
            });

            if (!supervisor) {
                throw new NotFoundException('Supervisor not found');
            }

            
            if (supervisor instanceof Employee) { // or check supervisor.type === 'EMPLOYEE'
                throw new BadRequestException('An Employee cannot be a supervisor.');
            }

            staff.supervisor = supervisor;
        }

        return this.staffRepository.save(staff);
    }

    async findAll(): Promise<StaffMember[]> {
        return this.staffRepository.find({
            relations: ['subordinates', 'supervisor'], 
        });
    }

    async getSalary(id: number, atDateStr: string): Promise<number> {
        const atDate = new Date(atDateStr);
        const staff = await this.findStaffMemberWithSurbodinates(id);
        if (!staff) {
            throw new NotFoundException(`Staff member with ID ${id} not found`);
        }
        return staff.calculateSalary(atDate);
    }

    private async findStaffMemberWithSurbodinates(id: number): Promise<StaffMember | null> {
    
    const staff = await this.staffRepository.findOne({ where: { id } });
    
    if (!staff) return null;

    return this.staffRepository.findDescendantsTree(staff);
  }
}
