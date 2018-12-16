import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuickTransferComponent } from './quick-transfer.component';

const routes: Routes = [
  {
    path: '',
    component: QuickTransferComponent,
    data: {
      title: 'Quick Transfers',
      icon: 'icon-corner-circle',
      caption: 'QUickly send modey to your frequent beneficiaries',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuickTransferRoutingModule { }
