import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GtbFxComponent } from './gtb-fx.component';

const routes: Routes = [
  {
    path: '',
    component: GtbFxComponent,
    data: {
      title: 'GTBank FX Transfer',
      icon: 'icon-alert-triangle',
      caption: 'Guarantee Trust Bank FX transfer',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GtbFxRoutingModule { }
