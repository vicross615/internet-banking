import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountUpgradeComponent } from './account-upgrade.component';

const routes: Routes = [
  {
    path: '',
    component: AccountUpgradeComponent,
    data: {
      title: 'Account Upgrade',
      icon: 'icon-arrow-up',
      caption: 'Upload neccessary files to Upgrade your account',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountUpgradeRoutingModule { }
