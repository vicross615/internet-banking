import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GtTargetRoutingModule } from './gt-target-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { GtTargetComponent } from './gt-target.component';

@NgModule({
  imports: [
    CommonModule,
    GtTargetRoutingModule,
    SharedModule
  ],
  declarations: [GtTargetComponent]
})
export class GtTargetModule { }
