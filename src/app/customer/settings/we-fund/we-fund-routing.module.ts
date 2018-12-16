import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeFundComponent } from './we-fund.component';

const routes: Routes = [
  {
    path: '',
    component: WeFundComponent,
    data: {
      title: 'We Fund',
      icon: 'icon-corner-down-left',
      caption: 'Start Your own Corporative Society(Esusu)',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeFundRoutingModule { }
