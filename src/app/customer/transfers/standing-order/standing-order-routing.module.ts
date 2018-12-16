import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StandingOrderComponent } from './standing-order.component';


const routes: Routes = [
  {
    path: '',
    component: StandingOrderComponent,
    data: {
      title: 'Standing Order',
      icon: 'icon-corner-down-left',
      caption: 'Send money to anyone. Its Quick and Easy',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandingOrderRoutingModule { }
