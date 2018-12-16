import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualCardRequestRoutingModule } from './virtual-card-request-routing.module';
import { VirtualCardRequestComponent } from './virtual-card-request.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    VirtualCardRequestRoutingModule,
    SharedModule
  ],
  declarations: [VirtualCardRequestComponent]
})
export class VirtualCardRequestModule { }
