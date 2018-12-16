import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GtSweepRoutingModule } from './gt-sweep-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { GtSweepComponent } from './gt-sweep.component';

@NgModule({
  imports: [
    CommonModule,
    GtSweepRoutingModule,
    SharedModule
  ],
  declarations: [GtSweepComponent]
})
export class GtSweepModule { }
