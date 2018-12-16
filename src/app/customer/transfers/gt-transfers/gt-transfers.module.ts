import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GtTransfersRoutingModule } from './gt-transfers-routing.module';
import { GtTransfersComponent } from './gt-transfers.component';
import {SharedModule} from '../../../shared/shared.module';




@NgModule({
  imports: [
    CommonModule,
    GtTransfersRoutingModule,
    SharedModule,
  ],
  declarations: [GtTransfersComponent]
})
export class GtTransfersModule { }
