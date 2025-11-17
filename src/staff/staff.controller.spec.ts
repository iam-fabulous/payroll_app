import { Test, TestingModule } from '@nestjs/testing';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create_staff.dto';
import { CalculateSalaryDto } from './dto/calculate_salary.dto';
import { UpdateSupervisorDto } from './dto/update_supervisor.dto';


const mockStaffService = {
  createStaff: jest.fn(),
  findAll: jest.fn(),
  getSalary: jest.fn(),
  findStaffById: jest.fn(), 
  getTotalSalary: jest.fn(),
  assignSupervisor: jest.fn(),
};

describe('StaffController', () => {
  let controller: StaffController;
  let service: StaffService;

  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [
        {
          provide: StaffService,
          useValue: mockStaffService, 
        },
      ],
    }).compile();

    controller = module.get<StaffController>(StaffController);
    service = module.get<StaffService>(StaffService);

    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Test for POST /staff ---
  describe('createStaff', () => {
    it('Test-01: should call the service createStaff with the correct DTO', async () => {
      
      const dto: CreateStaffDto = {
        name: 'Test Employee',
        dateJoined: '2023-01-01',
        baseSalary: 50000,
        type: 'EMPLOYEE',
      };
      const expectedResult = { id: 1, ...dto };
      mockStaffService.createStaff.mockResolvedValue(expectedResult);

      
      const result = await controller.createStaff(dto);

      
      // Check 1: Did the controller return what the service gave it?
      expect(result).toEqual(expectedResult);
      // Check 2: Was the service's createStaff method called with the right data?
      expect(service.createStaff).toHaveBeenCalledWith(dto);
      // Check 3: Was it called only once?
      expect(service.createStaff).toHaveBeenCalledTimes(1);
    });
  });

  // --- Test for GET /staff ---
  describe('findAll', () => {
    it('Test-02: should call service findAll with the name filter', async () => {
      
      const name = 'Fabulous';
      const expectedResult = [{ id: 4, name: 'Fabulous Sales' }];
      mockStaffService.findAll.mockResolvedValue(expectedResult);

      
      const result = await controller.findAll(name);

      
      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(name);
    });

    it('Test-03: should call service findAll with no name', async () => {
      await controller.findAll(undefined);
      expect(service.findAll).toHaveBeenCalledWith(undefined);
    });
  });

  // --- Test for GET /staff/salary ---
  describe('getSalary', () => {
    it('Test-04: should call getSalary and findStaffById and return a formatted object', async () => {
      
      const query: CalculateSalaryDto = { staffId: 1, currentDate: '2025-01-01' };
      const mockStaff = { id: 1, name: 'Big Boss', type: 'MANAGER', /*...other props*/ };
      const mockSalary = 1250;
      
      mockStaffService.getSalary.mockResolvedValue(mockSalary);
      mockStaffService.findStaffById.mockResolvedValue(mockStaff);

      
      const result = await controller.getSalary(query);

      
      expect(service.getSalary).toHaveBeenCalledWith(1, '2025-01-01');
      expect(service.findStaffById).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        staffId: 1,
        staffName: 'Big Boss',
        salary: 1250,
        asOf: '2025-01-01',
      });
    });


  });

  // --- Test for GET /staff/total-salary ---
  describe('getTotalSalary', () => {
    it('Test-05: should call getTotalSalary with the provided date', async () => {
      const dateStr = '2025-01-01';
      mockStaffService.getTotalSalary.mockResolvedValue(50000);
      
      await controller.getTotalSalary(dateStr);

      expect(service.getTotalSalary).toHaveBeenCalledWith(dateStr);
    });
  });

  // --- Test for PATCH /staff/assign-supervisor ---
  describe('assignSupervisor', () => {
    it('Test-06: should call assignSupervisor with IDs from the DTO body', async () => {
     
      const dto: UpdateSupervisorDto = { staffId: 5, supervisorId: 2 };
      const expectedResult = { id: 5, name: 'Staff', supervisor: { id: 2 } };
      mockStaffService.assignSupervisor.mockResolvedValue(expectedResult);
      
      const result = await controller.assignSupervisor(dto);

      expect(result).toEqual(expectedResult);
      expect(service.assignSupervisor).toHaveBeenCalledWith(5, 2);
    });
  });
});