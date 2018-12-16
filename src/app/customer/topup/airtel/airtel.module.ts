import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirtelComponent } from './airtel.component';
import { SharedModule } from '../../../shared/shared.module';
import { AirtelRoutingModule } from './airtel-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AirtelRoutingModule,
    SharedModule
  ],
  declarations: [AirtelComponent]
})
export class AirtelModule { }
