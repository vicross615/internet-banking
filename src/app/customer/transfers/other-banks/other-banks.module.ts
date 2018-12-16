import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtherBanksRoutingModule } from './other-banks-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { OtherBanksComponent } from './other-banks.component';


@NgModule({
  imports: [
    CommonModule,
    OtherBanksRoutingModule,
    SharedModule
  ],
  declarations: [OtherBanksComponent]
})
export class OtherBanksModule { }
