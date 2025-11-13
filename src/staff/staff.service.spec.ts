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
    findDescendantsTree: jest.fn(),
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


        describe('getSalary', () => {
            const atDate = '2025-01-01';

            it('Test-07: should throw NotFoundException if staff member does not exist', async () => {
            
            mockStaffRepository.findOne.mockResolvedValue(null);

            await expect(service.getSalary(999, atDate)).rejects.toThrow(NotFoundException);
            });

            it('Test-08:should return the calculated salary for a valid Employee', async () => {
                
            const employee = new Employee();
            employee.baseSalary = 2000;
            employee.dateJoined = new Date('2024-01-01'); // 1 year worked


            mockStaffRepository.findOne.mockResolvedValue(employee);
            
            mockStaffRepository.findDescendantsTree.mockResolvedValue(employee);

            
            const result = await service.getSalary(1, atDate);

            // Assert: Base (2000) + 1 year bonus (3% = 60) = 2060
            expect(result).toBe(2060);
            });

            it('Test-09:should return calculated salary for Manager including subordinates', async () => {

            const sub = new Employee();
            sub.baseSalary = 1000;
            sub.dateJoined = new Date(atDate); // 0 bonus
            // Sub salary = 1000

            const manager = new Manager();
            manager.baseSalary = 2000;
            manager.dateJoined = new Date(atDate); // 0 bonus
            manager.subordinates = [sub]; // Link them
            
            
            mockStaffRepository.findOne.mockResolvedValue(manager);
            mockStaffRepository.findDescendantsTree.mockResolvedValue(manager);

            
            const result = await service.getSalary(2, atDate);

            // Assert: 
            // Manager Base (2000) + 
            // Manager Team Bonus (0.5% of 1000 = 5) 
            // Total = 2005
            expect(result).toBe(2005);
            });


            const now = new Date('2025-01-01');
            const tenYearsAgo = new Date('2015-01-01'); // 10 years worked
            const twentyYearsAgo = new Date('2005-01-01'); // 20 years worked

            it('LOGIC-01: Employee salary should include 3% per year', async () => {
            // Arrange: Employee worked 10 years. 10 * 3% = 30% bonus.
            // Base: 1000 -> Bonus: 300 -> Total: 1300
            const employee = new Employee();
            employee.baseSalary = 1000;
            employee.dateJoined = tenYearsAgo;

            mockStaffRepository.findOne.mockResolvedValue(employee);
            mockStaffRepository.findDescendantsTree.mockResolvedValue(employee);
            
            const result = await service.getSalary(1, now.toISOString());

            
            expect(result).toBe(1300);
            });

                it('LOGIC-02: Employee salary should CAP at 30% bonus', async () => {
                    // Arrange: Employee worked 20 years. 
                    // Math: 20 * 3% = 60%. BUT cap is 30%.
                    // Base: 1000 -> Bonus Cap: 300 -> Total: 1300
                    const employee = new Employee();
                    employee.baseSalary = 1000;
                    employee.dateJoined = twentyYearsAgo; // Worked 20 years

                    mockStaffRepository.findOne.mockResolvedValue(employee);
                    mockStaffRepository.findDescendantsTree.mockResolvedValue(employee);
                    // Act
                    const result = await service.getSalary(1, now.toISOString());

                    // Assert
                    expect(result).toBe(1300); // Should match the cap, not 1600
                 });

        });
    })
