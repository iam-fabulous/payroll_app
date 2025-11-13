
import { Transform } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
  ManyToOne,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';


@Entity({ name: 'staff_member'})
@Tree("materialized-path")
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

  
  @TreeParent()
  supervisor: StaffMember;

  
  @TreeChildren()
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
