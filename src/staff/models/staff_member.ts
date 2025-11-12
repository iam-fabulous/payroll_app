
import { Transform } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
  ManyToOne,
  OneToMany,
} from 'typeorm';


@Entity({ name: 'staff_member'})

@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class StaffMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Transform(({value}) => {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    return value;
  })
  dateJoined: Date;

  @Column({ type: 'decimal' }) // Use 'decimal' for money
  baseSalary: number;

  
  @ManyToOne(() => StaffMember, (staff) => staff.subordinates, {
    nullable: true, 
    onDelete: 'SET NULL', 
  })
  supervisor: StaffMember;

  
  @OneToMany(() => StaffMember, (staff) => staff.supervisor)
  subordinates: StaffMember[];

  
  public calculateYearsWorked(currentDate: Date): number {
    // A simple way to calculate full years
    const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
    const durationMs = currentDate.getTime() - this.dateJoined.getTime();
    
    // We only care about full, completed years
    return Math.floor(durationMs / msPerYear);
  }

  
  public abstract calculateSalary(currentDate: Date): number;
}
