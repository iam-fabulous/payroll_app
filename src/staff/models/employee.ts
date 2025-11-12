import { ChildEntity } from 'typeorm';
import { StaffMember } from './staff_member';


@ChildEntity('EMPLOYEE')
export class Employee extends StaffMember {
  

  public calculateSalary(atDate: Date): number {
    const yearsWorked = this.calculateYearsWorked(atDate);

    // 3% per year
    const yearlyBonusPercent = yearsWorked * 0.03;

    // Capped at 30%
    const cappedBonusPercent = Math.min(yearlyBonusPercent, 0.30);

    const bonusAmount = this.baseSalary * cappedBonusPercent;

    
    return Number(this.baseSalary) + bonusAmount;
  }
}
