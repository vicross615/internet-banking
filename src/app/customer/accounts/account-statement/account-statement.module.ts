import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountStatementRoutingModule } from './account-statement-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { AccountStatementComponent } from './account-statement.component';

@NgModule({
  imports: [
    CommonModule,
    AccountStatementRoutingModule,
    SharedModule
  ],
  declarations: [AccountStatementComponent]
})
export class AccountStatementModule { }
