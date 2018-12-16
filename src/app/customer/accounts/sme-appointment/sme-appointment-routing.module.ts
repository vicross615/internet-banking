import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmeAppointmentComponent } from './sme-appointment.component';

const routes: Routes = [
  {
    path: '',
    component: SmeAppointmentComponent,
    data: {
      title: 'SME Appointment',
      icon: 'icon-users',
      caption: 'Book an appointment to see your account manager',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmeAppointmentRoutingModule { }
