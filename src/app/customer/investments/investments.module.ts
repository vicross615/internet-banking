import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestmentsRoutingModule } from './investments-routing.module';
import { InvestmentsComponent } from './investments.component';
import { SharedModule } from '../../shared/shared.module';
import { SelectModule } from 'ng-select';
import { InvestmentStatusComponent } from './investment-status/investment-status.component';
@NgModule({
  imports: [
    CommonModule,
    InvestmentsRoutingModule,
    SharedModule,
    SelectModule
  ],
  declarations: [InvestmentsComponent, InvestmentStatusComponent]
})
export class InvestmentsModule { }
