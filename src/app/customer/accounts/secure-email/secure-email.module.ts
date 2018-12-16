import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecureEmailRoutingModule } from './secure-email-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SecureEmailComponent } from './secure-email.component';

@NgModule({
  imports: [
    CommonModule,
    SecureEmailRoutingModule,
    SharedModule
  ],
  declarations: [SecureEmailComponent]
})
export class SecureEmailModule { }
