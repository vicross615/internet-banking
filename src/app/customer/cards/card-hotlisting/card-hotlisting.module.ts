import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardHotlistingRoutingModule } from './card-hotlisting-routing.module';
import { CardHotlistingComponent } from './card-hotlisting.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CardHotlistingRoutingModule,
    SharedModule
  ],
  exports: [CardHotlistingComponent],
  declarations: [CardHotlistingComponent]
})
export class CardHotlistingModule { }
