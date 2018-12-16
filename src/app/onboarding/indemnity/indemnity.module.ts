import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IndemnityRoutingModule} from './indemnity-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {MatButtonModule, MatGridListModule} from '@angular/material';
import { IndemnityComponent } from './indemnity.component';

@NgModule({
  imports: [
    CommonModule,
    IndemnityRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    MatGridListModule,
    MatButtonModule
  ],
  declarations: [IndemnityComponent]
})
export class IndemnityModule { }
