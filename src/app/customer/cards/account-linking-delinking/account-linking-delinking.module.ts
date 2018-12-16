import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { AccountLinkingDelinkingRoutingModule } from './account-linking-delinking-routing.module';
import { AccountLinkingDelinkingComponent } from './account-linking-delinking.component';

@NgModule({
  imports: [
    CommonModule,
    AccountLinkingDelinkingRoutingModule,
    SharedModule
  ],
  declarations: [AccountLinkingDelinkingComponent]
})
export class AccountLinkingDelinkingModule { }
