import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { SmileRoutingModule } from './smile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SmileRoutingModule,
    SharedModule
  ],
  declarations: []
})
export class SmileModule { }
