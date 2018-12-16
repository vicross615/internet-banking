import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IReferComponent } from './i-refer.component';

const routes: Routes = [
  {
    path: '',
    component: IReferComponent,
    data: {
      title: 'IRefer',
      icon: 'icon-file',
      caption: 'Refer a customer to GtBank',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IReferRoutingModule { }
