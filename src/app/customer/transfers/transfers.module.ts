import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransfersRoutingModule } from './transfers-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { TransfersComponent } from './transfers.component';

@NgModule({
  imports: [
    CommonModule,
    TransfersRoutingModule,
    SharedModule,
  ],
  declarations: [TransfersComponent]
})
export class TransfersModule { }
