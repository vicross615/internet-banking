import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
    NgbModule,
    SimpleNotificationsModule.forRoot()
  ],
  declarations: [AccountsComponent],
})
export class AccountsModule { }
