import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreRegisteredRoutingModule } from './pre-registered-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { PreRegisteredComponent } from './pre-registered.component';

@NgModule({
  imports: [
    CommonModule,
    PreRegisteredRoutingModule,
    SharedModule
  ],
  declarations: [PreRegisteredComponent]
})
export class PreRegisteredModule { }
