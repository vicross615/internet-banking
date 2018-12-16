import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlockedFundsComponent } from './blocked-funds.component';

const routes: Routes = [
  {
    path: '',
    component: BlockedFundsComponent,
    data: {
      title: 'Blocked Funds',
      icon: 'icon-bar',
      caption: 'VIew Blocked Funds',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlockedFundsRoutingModule { }
