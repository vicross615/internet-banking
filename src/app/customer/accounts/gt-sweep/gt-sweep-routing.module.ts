import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GtSweepComponent } from './gt-sweep.component';

const routes: Routes = [
  {
    path: '',
    component: GtSweepComponent,
    data: {
      title: 'GTSweep',
      icon: 'icon-file',
      caption: 'Link your accounts',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GtSweepRoutingModule { }
