import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryAdvanceRoutingModule } from './salary-advance-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SalaryAdvanceComponent } from './salary-advance.component';


@NgModule({
  imports: [
    CommonModule,
    SalaryAdvanceRoutingModule,
    SharedModule
  ],
  declarations: [SalaryAdvanceComponent]
})
export class SalaryAdvanceModule { }
