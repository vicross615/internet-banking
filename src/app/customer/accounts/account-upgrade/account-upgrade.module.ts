import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountUpgradeRoutingModule } from './account-upgrade-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { AccountUpgradeComponent } from './account-upgrade.component';

@NgModule({
  imports: [
    CommonModule,
    AccountUpgradeRoutingModule,
    SharedModule
  ],
  declarations: [AccountUpgradeComponent]
})
export class AccountUpgradeModule { }
