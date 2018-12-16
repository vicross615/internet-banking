import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtherBankFxRoutingModule } from './other-bank-fx-routing.module';
import { OtherBankFxComponent } from './other-bank-fx.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    OtherBankFxRoutingModule,
    SharedModule
  ],
  declarations: [OtherBankFxComponent]
})
export class OtherBankFxModule { }
