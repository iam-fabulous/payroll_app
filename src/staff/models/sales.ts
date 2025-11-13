
import { ChildEntity } from 'typeorm';
import { StaffMember } from './staff_member';

@ChildEntity('SALES')
export class Sales extends StaffMember {
  
  public calculateSalary(atDate: Date): number {
    const yearsWorked = this.calculateYearsWorked(atDate); 

    // 1% per year, capped at 35%
    const yearlyBonusPercent = Math.min(yearsWorked * 0.01, 0.35); 
    const yearlyBonusAmount = this.baseSalary * yearlyBonusPercent;

    // 0.3% of *all* subordinates at any level
    let allSubordinatesBonus = 0;
    const allSubordinates = this.getAllSubordinates(this); 

    if (allSubordinates.length > 0) {
      const allSubordinatesSalaries = allSubordinates.reduce(
        (total, sub) => total + sub.calculateSalary(atDate),
        0,
      );
      allSubordinatesBonus = allSubordinatesSalaries * 0.003;
    }

    return Number(this.baseSalary) + yearlyBonusAmount + allSubordinatesBonus;
  }

    private getAllSubordinates(staffMember: StaffMember): StaffMember[] {
    let allSubs: StaffMember[] = [];

    
    if (!staffMember.subordinates || staffMember.subordinates.length === 0) {
      return [];
    }

    allSubs = [...staffMember.subordinates];

    for (const sub of staffMember.subordinates) {
      
      allSubs = allSubs.concat(this.getAllSubordinates(sub));
    }

    return allSubs;
  }
}