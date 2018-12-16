import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiariesRoutingModule } from './beneficiaries-routing.module';
import { BeneficiariesComponent } from './beneficiaries.component';
import {SharedModule} from '../../../shared/shared.module';
import {SelectModule} from 'ng-select';

@NgModule({
  imports: [
    CommonModule,
    BeneficiariesRoutingModule,
    SharedModule,
    SelectModule
  ],
  declarations: [BeneficiariesComponent]
})
export class BeneficiariesModule { }
