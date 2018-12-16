import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillersListComponent } from './billers-list.component';

const routes: Routes = [
  {
    path: '',
    component: BillersListComponent,
    data: {
      title: 'Billers',
      icon: 'icon-square',
      caption: 'Select Biller',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillersListRoutingModule { }
