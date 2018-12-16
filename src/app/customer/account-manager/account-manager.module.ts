import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountManagerComponent } from './account-manager.component';
import { AccountManagerRoutingModule } from './account-manager-routing.module';


@NgModule({
  imports: [
    CommonModule,
    AccountManagerRoutingModule,
    SharedModule,
    NgbModule
  ],
  declarations: [AccountManagerComponent],
  bootstrap: [AccountManagerComponent]
})
export class AccountManagerModule { }
