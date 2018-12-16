import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardStatementRoutingModule } from './card-statement-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { CardStatementComponent } from './card-statement.component';

@NgModule({
  imports: [
    CommonModule,
    CardStatementRoutingModule,
    SharedModule
  ],
  declarations: [CardStatementComponent]
})
export class CardStatementModule { }
