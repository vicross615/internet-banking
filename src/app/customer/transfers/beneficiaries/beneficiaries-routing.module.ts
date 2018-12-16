import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeneficiariesComponent } from './beneficiaries.component';

const routes: Routes = [
  {
    path: '',
    component: BeneficiariesComponent,
    data: {
      title: 'Beneficiaries',
      icon: 'icon-user-plus',
      caption: 'Manage your saved Beneficiaries.',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficiariesRoutingModule { }
