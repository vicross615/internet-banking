import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IReferRoutingModule } from './i-refer-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { IReferComponent } from './i-refer.component';

@NgModule({
  imports: [
    CommonModule,
    IReferRoutingModule,
    SharedModule
  ],
  declarations: [IReferComponent]
})
export class IReferModule { }
