import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BvnLinkerRoutingModule } from './bvn-linker-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { BvnLinkerComponent } from './bvn-linker.component';

@NgModule({
  imports: [
    CommonModule,
    BvnLinkerRoutingModule,
    SharedModule
  ],
  declarations: [BvnLinkerComponent]
})
export class BvnLinkerModule { }
