import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerComponent} from './customer/customer.component';
import {OnboardingComponent} from './onboarding/onboarding.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: './customer/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'transfers',
        loadChildren: './customer/transfers/transfers.module#TransfersModule'
      },
      {
        path: 'accounts',
        loadChildren: './customer/accounts/accounts.module#AccountsModule'
      },
      {
        path: 'cards',
        loadChildren: './customer/cards/cards.module#CardsModule'
      },
      {
        path: 'investments',
        loadChildren: './customer/investments/investments.module#InvestmentsModule'
      },
      {
        path: 'payments',
        loadChildren: './customer/bills-payment/bills-payment.module#BillsPaymentModule'
      },
      {
        path: 'topup',
        loadChildren: './customer/topup/topup.module#TopupModule'
      },
      {
        path: 'fx',
        loadChildren: './customer/fx/fx.module#FxModule'
      },
      {
        path: 'acct-officer',
        loadChildren: './customer/account-manager/account-manager.module#AccountManagerModule'
      },
      {
        path: 'settings',
        loadChildren: './customer/settings/settings.module#SettingsModule'
      },
      {
        path: 'logout',
        redirectTo: 'transfers',
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    component: OnboardingComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: './onboarding/onboarding.module#OnboardingModule'
      }
     /*  {
        path: 'maintenance/offline-ui',
        loadChildren: './theme/maintenance/offline-ui/offline-ui.module#OfflineUiModule'
      } */
    ]
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
