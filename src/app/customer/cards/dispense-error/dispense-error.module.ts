import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { DispenseErrorComponent } from './dispense-error.component';
import { DispenseErrorRoutingModule } from './dispense-error-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DispenseErrorRoutingModule
  ],
  declarations: [DispenseErrorComponent],
 // providers: [DispenseErrorService]
})
export class DispenseErrorModule { }
