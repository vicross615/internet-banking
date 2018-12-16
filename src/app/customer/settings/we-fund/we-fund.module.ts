import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeFundRoutingModule } from './we-fund-routing.module';
import { WeFundComponent } from './we-fund.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    WeFundRoutingModule,
    SharedModule
  ],
  declarations: [WeFundComponent]
})
export class WeFundModule { }
