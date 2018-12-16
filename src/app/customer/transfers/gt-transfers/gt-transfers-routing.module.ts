import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GtTransfersComponent } from './gt-transfers.component';

const routes: Routes = [
  {
    path: '',
    component: GtTransfersComponent,
    data: {
      title: 'GTBank Transfers',
      icon: 'icon-corner-down-left',
      caption: 'Send money to GTBank Account Holders',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GtTransfersRoutingModule { }
