import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MtnComponent } from './mtn.component';
import { SharedModule } from '../../../shared/shared.module';
import { MtnRoutingModule } from './mtn-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MtnRoutingModule,
    SharedModule
  ],
  declarations: [MtnComponent]
})
export class MtnModule { }
