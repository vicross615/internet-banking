import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraftInTransitRoutingModule } from './draft-in-transit-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { DraftInTransitComponent } from './draft-in-transit.component';

@NgModule({
  imports: [
    CommonModule,
    DraftInTransitRoutingModule,
    SharedModule
  ],
  declarations: [DraftInTransitComponent]
})
export class DraftInTransitModule { }
