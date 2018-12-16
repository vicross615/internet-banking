import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockedFundsRoutingModule } from './blocked-funds-routing.module';
import { BlockedFundsComponent } from './blocked-funds.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    BlockedFundsRoutingModule,
    SharedModule
  ],
  declarations: [BlockedFundsComponent]
})
export class BlockedFundsModule { }
