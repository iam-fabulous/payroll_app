import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffModule } from './staff/staff.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { StaffMember } from './staff/models/staff_member';
import { Employee } from './staff/models/employee';
import { Manager } from './staff/models/manager';
import { Sales } from './staff/models/sales';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'company.sqlite',
      entities: [
        StaffMember,
        Employee,
        Manager,
        Sales,
      ],

      synchronize: true,
    }),
    StaffModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
