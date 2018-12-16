import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnAccountRoutingModule } from './own-account-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { OwnAccountComponent } from './own-account.component';

@NgModule({
  imports: [
    CommonModule,
    OwnAccountRoutingModule,
    SharedModule
  ],
  declarations: [OwnAccountComponent]
})
export class OwnAccountModule { }
