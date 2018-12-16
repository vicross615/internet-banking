import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GtTargetComponent } from './gt-target.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: GtTargetComponent,
    data: {
      title: 'GT Target',
      icon: 'icon-user',
      caption: 'Create a GT Target savings account or view your transaction history',
      status: true,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GtTargetRoutingModule { }
