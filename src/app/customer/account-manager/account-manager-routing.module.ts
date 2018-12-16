import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountManagerComponent } from './account-manager.component';

const routes: Routes = [
  {

    path: '',
    component: AccountManagerComponent,
    data: {
      title: 'Account Manager',
      icon: 'icon-user'
    },

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagerRoutingModule { }
