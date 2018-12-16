import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InternationalSpendLimitComponent } from './international-spend-limit.component';

const routes: Routes = [
  {
    path: '',
    component: InternationalSpendLimitComponent,
    data: {
      title: 'International Spend Limit',
      icon: 'icon-alert-triangle',
      caption: 'Block your card in case of theft',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternationalSpendLimitRoutingModule { }
