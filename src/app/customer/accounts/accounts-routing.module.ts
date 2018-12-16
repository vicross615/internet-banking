import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountsComponent } from './accounts.component';

const accountsRoutes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    data: {
      title: 'Accounts',
      icon: 'icon-file-text',
      status: true
    },
    children: [
      {
        path: '',
        redirectTo: 'statement',
        pathMatch: 'full'
      },
      {
        path: 'account-upgrade',
        loadChildren: './account-upgrade/account-upgrade.module#AccountUpgradeModule'
      },
      {
        path: 'add-account',
        loadChildren: './add-account/add-account.module#AddAccountModule'
      },
      {
        path: 'bvn-linker',
        loadChildren: './bvn-linker/bvn-linker.module#BvnLinkerModule'
      },
      {
        path: 'generate-statement',
        loadChildren: './generate-statement/generate-statement.module#GenerateStatementModule'
      },
      {
        path: 'statement',
        loadChildren: './account-statement/account-statement.module#AccountStatementModule'
      },
      {
        path: 'gt-sweep',
        loadChildren: './gt-sweep/gt-sweep.module#GtSweepModule'
      },
      {
        path: 'i-refer',
        loadChildren: './i-refer/i-refer.module#IReferModule'
      },
      {
        path: 'open-dom-account',
        loadChildren: './open-dom-account/open-dom-account.module#OpenDomAccountModule'
      },
      {
        path: 'secure-email',
        loadChildren: './secure-email/secure-email.module#SecureEmailModule'
      },
      {
        path: 'sme-appointment',
        loadChildren: './sme-appointment/sme-appointment.module#SmeAppointmentModule'
      },
      {
        path: 'additional-account',
        loadChildren: './additional-account/additional-account.module#AdditionalAccountModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(accountsRoutes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
