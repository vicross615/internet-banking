import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration.component';
import {RegistrationRoutingModule} from './registration-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {RegistrationService} from '../registration/registration.service';

@NgModule({
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    SharedModule
  ],
  declarations: [RegistrationComponent],
  providers: [ RegistrationService]
})
export class RegistrationModule { }
