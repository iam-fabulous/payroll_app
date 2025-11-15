# Payroll Management System

A robust, hierarchical payroll API built with **NestJS**, **TypeORM**, and **SQLite**. This application models a corporate structure (Employees, Managers, Sales) and implements a complex, date-aware salary calculation engine using polymorphic business logic. 

    Api demo link below!

---

## Features

* **Staff Management:** Create Employees, Managers, and Sales staff with validation.
* **Hierarchy Management:** Assign supervisors and manage reporting lines.
    * *Constraint Enforcement:* Ensures Employees cannot be supervisors.
* **Dynamic Salary Calculation:**
    * Calculates salaries for any arbitrary date (past, present, or future).
    * **Base Logic:** Base Salary + Longevity Bonus (Years Worked × Rate).
    * **Caps:** Enforces specific bonus caps (30% for Employees, 40% for Managers, 35% for Sales).
* **Team Bonuses:**
    * **Managers:** Earn 0.5% of their direct subordinates' total salary.
    * **Sales:** Earn 0.3% of their *entire* recursive hierarchy (subordinates of subordinates).
* **Analytics:** Calculate the total salary expenditure for the entire company for a specific date.
* **Search:** Find staff members by partial name matching.

---

## Architecture & Design Decisions

### 1. Single Table Inheritance (STI)
Instead of creating three separate database tables, I used TypeORM's Single Table Inheritance pattern.
* **Why:** All staff types share core data (Name, Join Date, Base Salary).
* **Implementation:** A single `staff_member` table with a `type` discriminator column (`EMPLOYEE`, `MANAGER`, `SALES`).
* **Benefit:** Simplifies database queries and allows fetching the entire company hierarchy in a single call without expensive `JOIN` operations.

### 2. Polymorphism over Conditionals
I avoided using large `if/else` or `switch` statements to handle the different salary rules.
* **Implementation:** A base `StaffMember` abstract class defines the `calculateSalary()` contract. Each subclass (`Employee`, `Manager`, `Sales`) implements its own specific logic.
* **Benefit:** Adheres to the **Open/Closed Principle**. Adding a new role (e.g., "Director") requires creating a new class, not modifying existing code.

### 3. Materialized Path (Tree Repository)
To handle the recursive "Sales" bonus (which requires summing salaries for the entire deep hierarchy), I used the **Materialized Path** pattern via TypeORM's `@Tree`.
* **Why:** It allows fetching deep nested trees efficiently.
* **Benefit:** Prevents the "N+1 query problem" when calculating totals for the company.

---

## Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** SQLite (Serverless, file-based)
* **ORM:** TypeORM
* **Validation:** class-validator & class-transformer
* **Testing:** Jest

---

## Setup & Installation

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Application:**
    ```bash
    npm run start:dev
    ```
    *The server will start on `http://localhost:3000` and automatically generate the `company.sqlite` database file.*

3.  **Run Tests:**
    ```bash
    npm test
    ```
    *Includes Unit Tests for salary logic and hierarchy validation.*

---

## API Reference

### Staff Management

#### **Create Staff Member**
`POST /staff`

Creates a new staff member. i also modified this endpoint to get a single staff or staffs that bears the same name!
* **Body:**
    ```json
    {
      "name": "John Doe",
      "joinDate": "2023-01-01",
      "baseSalary": 5000,
      "type": "EMPLOYEE"
    }
    ```
    *Type options: `EMPLOYEE`, `MANAGER`, `SALES`*

#### **List All Staff**
`GET /staff`

1. Retrieves all staff members.
* **Query Param:** `name` (Optional) - Filter by name.

2. Retrieves a staff(s) with 'name'.
* **Example:** `GET /staff?name=John`

#### **Assign Supervisor**
`PATCH /staff/:staffId/assign-supervisor/:supervisorId`

Updates a staff member to report to a new supervisor.
* **Body:**
    ```json
    {
        "staffId": 5,
        "supervisorId": 2
    }
    ```

---

### Salary Calculations

#### **Get Individual Salary**
`GET /staff/salary`

Calculates the salary for a specific person as of a specific date.
* **Query Params:**
    * `staffId` (Required)
    * `currentDate` (Optional, defaults to today)
* **Example:** `GET /staff/salary?staffId=1&currentDate=2025-01-01`
* **Response:**
    ```json
    {
      "staffId": 1,
      "staffName": "Big Boss",
      "salary": 1250.5,
      "asOf": "2025-01-01"
    }
    ```

#### **Get Total Company Salary**
`GET /staff/total-salary`

Calculates the sum of ALL salaries in the company for a specific date.
* **Query Params:**
    * `atDate` (Optional, defaults to today)
* **Example:** `GET /staff/total-salary?atDate=2025-01-01`
* **Response:**
    ```json
    {
      "totalSalaryExpenditure": 20667.725,
      "asOf": "2025-01-01"
    }
    ```

---

## Drawbacks & Future Improvements

1.  **Recursive Calculation Performance:**
    * *Current State:* Salary calculation happens in the application layer (Node.js) using recursion.
    * *Drawback:* For extremely large organizations (100k+ employees), this could be CPU intensive.
    * *Improvement:* Implement database-level stored procedures or materialized views to cache salary totals.

2.  **Hardcoded Business Rules:**
    * *Current State:* Bonus rates (3%, 0.5%) are defined in the class files.
    * *Improvement:* Move these rates to a database configuration table so HR can update them without to modify the code.

3.  **SQLite Concurrency:**
    * *Current State:* Uses SQLite for simplicity.
    * *Drawback:* SQLite locks the file during writes, limiting concurrency.
    * *Improvement:* Switch to **PostgreSQL** or **MongoDB** for production environments.


##  Live API Documentation (Swagger)

All endpoints are fully documented and testable. Once the server is running, you can access the interactive Swagger UI here:

**[http://localhost:3000/api](http://localhost:3000/api-docs)**


### API Demo

**![Demo of Payroll API](https://ibb.co/rfMN64jm)**
---

**Author:** Innah Emmanuel Ebuka