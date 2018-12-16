import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './logout.component';
import {LogoutRoutingModule} from './logout-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { RatingModule } from '../rating/rating.module';

@NgModule({
  imports: [
    CommonModule,
    LogoutRoutingModule,
    RatingModule,
    SharedModule
  ],
  declarations: [LogoutComponent]
})
export class LogoutModule { }
