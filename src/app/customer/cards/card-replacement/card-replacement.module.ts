import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardReplacementRoutingModule } from './card-replacement-routing.module';
import { CardReplacementComponent } from './card-replacement.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CardReplacementRoutingModule,
    SharedModule,
  ],
  declarations: [CardReplacementComponent]
})
export class CardReplacementModule { }
