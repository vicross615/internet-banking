import { NgModule } from '@angular/core';
import { DispenseErrorComponent } from './dispense-error.component';
import { Routes, RouterModule } from '@angular/router';

const DispenseErrorRoutes: Routes = [
  {
    path: '',
    component: DispenseErrorComponent,
    data: {
      title: 'Dispense Error',
      icon: 'icon-alert-triangle',
      caption: 'View dispense error for your  cards',
      status: true
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(DispenseErrorRoutes)],
  exports: [RouterModule]
})
export class DispenseErrorRoutingModule { }
