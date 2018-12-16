import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Customer',
      status: false
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      }
      /*
      {
        path: 'transfers',
        loadChildren: './transfers/transfers.module#TransfersModule'
      },
      {
        path: 'accounts',
        loadChildren: './accounts/accounts.module#AccountsModule'
      },
      {
        path: 'payments',
        loadChildren: './payments/payments.module#PaymentsModule'
      },
      {
        path: 'cards',
        loadChildren: './cards/cards.module#CardsModule'
      },
      {
        path: 'topup',
        loadChildren: './topup/topup.module#TopupModule'
      },
      {
        path: 'fx',
        loadChildren: './fx/fx.module#FxModule'
      },
      {
        path: 'receive-funds',
        loadChildren: './receive-funds/receive-funds.module#ReceiveFundsModule'
      },
      {
        path: 'investments',
        loadChildren: './investments/investments.module#InvestmentsModule'
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
      },
      {
        path: 'others',
        loadChildren: './others/others.module#OthersModule'
      }
      */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
