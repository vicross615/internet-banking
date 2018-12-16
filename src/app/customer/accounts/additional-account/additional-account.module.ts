import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalAccountRoutingModule } from './additional-account-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { AdditionalAccountComponent } from './additional-account.component';

@NgModule({
  imports: [
    CommonModule,
    AdditionalAccountRoutingModule,
    SharedModule
  ],
  declarations: [AdditionalAccountComponent]
})
export class AdditionalAccountModule { }
