import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GtbFxRoutingModule } from './gtb-fx-routing.module';
import { GtbFxComponent } from './gtb-fx.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    GtbFxRoutingModule,
    SharedModule
  ],
  declarations: [GtbFxComponent]
})
export class GtbFxModule { }
