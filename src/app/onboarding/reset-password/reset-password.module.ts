import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password.component';
import { SharedModule } from '../../shared/shared.module';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ResetPasswordRoutingModule
  ],
  declarations: [ResetPasswordComponent]
})
export class ResetPasswordModule { }
