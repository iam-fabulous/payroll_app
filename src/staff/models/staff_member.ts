// --- src/staff/models/staff_member.ts ---

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
  ManyToOne,
  OneToMany,
} from 'typeorm';

// @Entity tells TypeORM this class defines a database table
@Entity({ name: 'staff_member'})
// This is the "magic" for Single Table Inheritance.
// It creates a 'type' column to store 'EMPLOYEE', 'MANAGER', or 'SALES'.
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class StaffMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  joinDate: Date;

  @Column({ type: 'decimal' }) // Use 'decimal' for money
  baseSalary: number;

  // --- Relationships ---

  // This creates the 'supervisorId' foreign key column
  @ManyToOne(() => StaffMember, (staff) => staff.subordinates, {
    nullable: true, // CEO has no supervisor
    onDelete: 'SET NULL', // If a supervisor is deleted, set subordinates' supervisor to null
  })
  supervisor: StaffMember;

  // This is the "other side" of the relationship
  // It's a "virtual" property that TypeORM will fill in for us
  @OneToMany(() => StaffMember, (staff) => staff.supervisor)
  subordinates: StaffMember[];

  // --- Common Business Logic ---

  /**
   * A concrete helper method available to all subclasses.
   * Calculates the number of *full* years worked as of a specific date.
   */
  public calculateYearsWorked(atDate: Date): number {
    // A simple way to calculate full years
    const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
    const durationMs = atDate.getTime() - this.joinDate.getTime();
    
    // We only care about full, completed years
    return Math.floor(durationMs / msPerYear);
  }

  /**
   * This is our abstract "contract".
   * Every class that extends StaffMember *must* provide its own
   * implementation of this method.
   */
  public abstract calculateSalary(atDate: Date): number;
}
