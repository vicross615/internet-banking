import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternationalSpendLimitRoutingModule } from './international-spend-limit-routing.module';
import { InternationalSpendLimitComponent } from './international-spend-limit.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    InternationalSpendLimitRoutingModule,
    SharedModule
  ],
  declarations: [InternationalSpendLimitComponent]
})
export class InternationalSpendLimitModule { }
