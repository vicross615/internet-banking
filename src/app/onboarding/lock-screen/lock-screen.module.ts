import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockScreenComponent } from './lock-screen.component';
import {LockScreenRoutingModule} from './lock-screen-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { RatingModule } from '../rating/rating.module';

@NgModule({
  imports: [
    CommonModule,
    LockScreenRoutingModule,
    RatingModule,
    SharedModule
  ],
  declarations: [LockScreenComponent]
})
export class LockScreenModule { }
