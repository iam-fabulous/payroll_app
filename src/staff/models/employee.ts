// --- src/staff/models/employee.ts ---

import { ChildEntity } from 'typeorm';
import { StaffMember } from './staff_member';

// @ChildEntity('EMPLOYEE') tells TypeORM:
// "If the 'type' column in the 'staff_member' table is 'EMPLOYEE',
// create an instance of this Employee class."
@ChildEntity('EMPLOYEE')
export class Employee extends StaffMember {
  /**
   * Employee Salary Logic:
   * Base + 3% per year, capped at 30%.
   */
  public calculateSalary(atDate: Date): number {
    const yearsWorked = this.calculateYearsWorked(atDate);

    // 3% per year
    const yearlyBonusPercent = yearsWorked * 0.03;

    // Capped at 30%
    const cappedBonusPercent = Math.min(yearlyBonusPercent, 0.30);

    const bonusAmount = this.baseSalary * cappedBonusPercent;

    // TypeORM stores 'decimal' as string, so we parse it
    return Number(this.baseSalary) + bonusAmount;
  }
}
