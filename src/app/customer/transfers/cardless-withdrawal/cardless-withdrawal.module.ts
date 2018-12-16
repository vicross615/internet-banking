import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { CardlessWithdrawalComponent } from './cardless-withdrawal.component';
import { CardlessWithdrawalRoutingModule } from './cardless-withdrawal-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CardlessWithdrawalRoutingModule,
    SharedModule
  ],
  declarations: [CardlessWithdrawalComponent]
})
export class CardlessWithdrawalModule { }
