import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FxComponent } from './fx.component';

const routes: Routes = [
  {
    path: '',
    component: FxComponent,
    data: {
      title: 'Foriegn Exchange',
      icon: 'fas fa-dollar-sign'
    },
    children: [
      {
        path: '',
        redirectTo: 'other-bank-fx',
        pathMatch: 'full'
      },
      {
        path: 'other-bank-fx',
        loadChildren: './other-bank-fx/other-bank-fx.module#OtherBankFxModule'
      },
      {
        path: 'gtb-fx',
        loadChildren: './gtb-fx/gtb-fx.module#GtbFxModule'
      }
      // },
      // {
      //   path: 'add-account',
      //   loadChildren: './add-account/add-account.module#AddAccountModule'
      // },
      // {
      //   path: 'bvn-linker',
      //   loadChildren: './bvn-linker/bvn-linker.module#BvnLinkerModule'
      // }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FxRoutingModule { }
