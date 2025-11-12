import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffMember } from './models/staff_member';
import { Employee } from './models/employee';
import { Manager } from './models/manager';
import { Sales } from './models/sales';

const mockStaffRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
};

describe('StaffService', () => {
    let service: StaffService;
    let repository: any;

        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    StaffService,
                    {
                        provide: getRepositoryToken(StaffMember),
                        useValue: mockStaffRepository,
                    },
                ],
            }).compile();
                service = module.get<StaffService>(StaffService);
                repository = module.get(getRepositoryToken(StaffMember));

            jest.clearAllMocks();
        });

        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        describe('createStaff', () => {
            it('Test-01: should successfully create an Employee', async () => {
                
                const dto = {
                    name: 'Alice',
                    dateJoined: '2023-01-01',
                    baseSalary: 50000,
                    type: 'EMPLOYEE' as const,
                };
                
                
                mockStaffRepository.save.mockImplementation((staff) => {
                    staff.id = 1;
                    return Promise.resolve(staff);
                });

                
                const result = await service.createStaff(dto);

                
                expect(result).toBeInstanceOf(Employee); 
                expect(result.name).toEqual('Alice');
                expect(repository.save).toHaveBeenCalled();
                expect(result.id).toEqual(1);
            });

            it('Test-02: should successfully create a Manager', async () => {
                
                const dto = {
                    name: 'Bob',
                    dateJoined: '2022-01-01',
                    baseSalary: 80000,
                    type: 'MANAGER' as const,
                };

                mockStaffRepository.save.mockImplementation((staff) => {
                    staff.id = 2;
                    return Promise.resolve(staff);
                });

                
                const result = await service.createStaff(dto);

                
                expect(result).toBeInstanceOf(Manager); 
                expect(result.baseSalary).toEqual(80000);
            });


            it('Test-03: should successfully create a Sales Rep', async () => {
                
                const dto = {
                    name: 'Nelly',
                    dateJoined: '2022-01-01',
                    baseSalary: 150000,
                    type: 'SALES' as const,
                };

                mockStaffRepository.save.mockImplementation((staff) => {
                    staff.id = 3;
                    return Promise.resolve(staff);
                });

                
                const result = await service.createStaff(dto);

                
                expect(result).toBeInstanceOf(Sales); 
                expect(result.baseSalary).toEqual(150000);
            });


            it('Test-04: should create a staff member linked to a valid Supervisor', async () => {
                
                const supervisorMock = new Manager(); 
                supervisorMock.id = 10;
                supervisorMock.name = 'Big Boss';

                
                mockStaffRepository.findOne.mockResolvedValue(supervisorMock);
                
                mockStaffRepository.save.mockImplementation((staff) => {
                    staff.id = 4;
                    return Promise.resolve(staff);
                });

                const dto = {
                    name: 'Charlie',
                    dateJoined: '2023-01-01',
                    baseSalary: 50000,
                    type: 'EMPLOYEE' as const,
                    supervisorId: 10,
                };

                
                const result = await service.createStaff(dto);

                
                expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 10 } });
                expect(result.supervisor).toEqual(supervisorMock);
            });
        });

        describe('createStaff (Business Rules)', () => {
                it('Test-05: should throw NotFoundException if supervisor ID does not exist', async () => {
                    
                    mockStaffRepository.findOne.mockResolvedValue(null); 

                    const dto = {
                        name: 'Dave',
                        dateJoined: '2023-01-01',
                        baseSalary: 50000,
                        type: 'EMPLOYEE' as const,
                        supervisorId: 999, 
                    };

                    
                    await expect(service.createStaff(dto)).rejects.toThrow(NotFoundException);
                });

                it('Test-06: should throw BadRequestException if supervisor is an Employee (Forbidden)', async () => {
                        
                        const invalidSupervisor = new Employee();
                        invalidSupervisor.id = 5;

                        mockStaffRepository.findOne.mockResolvedValue(invalidSupervisor);

                        const dto = {
                            name: 'Eve',
                            dateJoined: '2023-01-01',
                            baseSalary: 50000,
                            type: 'EMPLOYEE' as const,
                            supervisorId: 5, 
                        };

                        
                        await expect(service.createStaff(dto)).rejects.toThrow(BadRequestException);
                });
            });

    })
