import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmeAppointmentRoutingModule } from './sme-appointment-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SmeAppointmentComponent } from './sme-appointment.component';

@NgModule({
  imports: [
    CommonModule,
    SmeAppointmentRoutingModule,
    SharedModule
  ],
  declarations: [SmeAppointmentComponent]
})
export class SmeAppointmentModule { }
