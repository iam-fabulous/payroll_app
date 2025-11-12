
import { ChildEntity } from 'typeorm';
import { StaffMember } from './staff_member';

@ChildEntity('MANAGER')
export class Manager extends StaffMember {
  
  public calculateSalary(atDate: Date): number {
    const yearsWorked = this.calculateYearsWorked(atDate); 

    // 5% per year, capped at 40%
    const yearlyBonusPercent = Math.min(yearsWorked * 0.05, 0.40); 
    const yearlyBonusAmount = this.baseSalary * yearlyBonusPercent;

    // 0.5% of first-level subordinates
    let subordinateBonus = 0;
    
    if (this.subordinates && this.subordinates.length > 0) {
      const firstLevelSalaries = this.subordinates.reduce(
        (total, sub) => total + sub.calculateSalary(atDate),
        0,
      );
      subordinateBonus = firstLevelSalaries * 0.005; 
    }

    return Number(this.baseSalary) + yearlyBonusAmount + subordinateBonus;
  }
}