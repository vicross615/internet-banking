import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProtectRoutingModule } from './card-protect-routing.module';
import { CardProtectComponent } from './card-protect.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CardProtectRoutingModule,
    SharedModule
  ],
  exports: [CardProtectComponent],
  declarations: [CardProtectComponent]
})
export class CardProtectModule { }
