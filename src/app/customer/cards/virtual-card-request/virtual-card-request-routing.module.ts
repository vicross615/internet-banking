import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VirtualCardRequestComponent } from './virtual-card-request.component';

const routes: Routes = [
  {
    path: '',
    component: VirtualCardRequestComponent,
    data: {
      title: 'Virtual Card Request',
      icon: 'icon-alert-triangle',
      caption: '',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VirtualCardRequestRoutingModule { }
