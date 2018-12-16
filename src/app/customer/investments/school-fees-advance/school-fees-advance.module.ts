import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { SchoolFeesAdvanceComponent } from './school-fees-advance.component';
import { SchoolFeesAdvanceRoutingModule } from './school-fees-advance-routing.module';


@NgModule({
  imports: [
    CommonModule,
    SchoolFeesAdvanceRoutingModule,
    SharedModule
  ],
  declarations: [SchoolFeesAdvanceComponent]
})
export class SchoolFeesAdvanceModule { }
