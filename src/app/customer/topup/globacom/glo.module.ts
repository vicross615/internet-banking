import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GloComponent } from './glo.component';
import { SharedModule } from '../../../shared/shared.module';
import { GloRoutingModule } from './glo-routing.module';

@NgModule({
  imports: [
    CommonModule,
    GloRoutingModule,
    SharedModule
  ],
  declarations: [GloComponent]
})
export class GloModule { }
