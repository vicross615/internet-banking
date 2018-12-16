import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinRetrievalRoutingModule } from './pin-retrieval-routing.module';
import { PinRetrievalComponent } from './pin-retrieval.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    PinRetrievalRoutingModule,
    SharedModule
  ],
  declarations: [PinRetrievalComponent]
})
export class PinRetrievalModule { }
