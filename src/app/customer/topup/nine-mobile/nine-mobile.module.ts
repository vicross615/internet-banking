import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NineMobileComponent } from './nine-mobile.component';
import { SharedModule } from '../../../shared/shared.module';
import { NineMobileRoutingModule } from './nine-mobile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    NineMobileRoutingModule,
    SharedModule
  ],
  declarations: [NineMobileComponent]
})
export class NineMobileModule { }
