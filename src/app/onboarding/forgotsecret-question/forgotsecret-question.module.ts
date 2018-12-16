import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotsecretQuestionComponent } from './forgotsecret-question.component';
import {ForgotSecretRoutingModule} from './forgot-secret-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {RegistrationService} from '../registration/registration.service'

@NgModule({
  imports: [
    CommonModule,
    ForgotSecretRoutingModule,
    SharedModule

  ],

  declarations: [
    
    ForgotsecretQuestionComponent
  ],

  providers:[RegistrationService]

})
export class ForgotsecretQuestionModule { }
