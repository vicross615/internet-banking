import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import {LoginRoutingModule} from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {MatButtonModule, MatGridListModule} from '@angular/material';
// import {NgPipesModule} from 'ngx-pipes';
@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    MatGridListModule,
    MatButtonModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
