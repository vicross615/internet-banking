import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashInTransitRoutingModule } from './cash-in-transit-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { CashInTransitComponent } from './cash-in-transit.component';

@NgModule({
  imports: [
    CommonModule,
    CashInTransitRoutingModule,
    SharedModule
  ],
  declarations: [CashInTransitComponent]
})
export class CashInTransitModule { }
