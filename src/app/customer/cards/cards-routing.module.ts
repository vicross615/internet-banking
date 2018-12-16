import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardsComponent } from './cards.component';

const cardsRoutes: Routes = [
  {
    path: '',
    component: CardsComponent,
    data: {
      title: 'My Cards',
      icon: 'icon-credit-card'
    },
    children: [
      {
        path: '',
        redirectTo: 'dispense-error',
        pathMatch: 'full'
      },
      // {
      //   path: 'card-hotlisting',
      //   loadChildren: './card-hotlisting/card-hotlisting.module#CardHotlistingModule'
      // },
      // {
      //   path: 'card-protect',
      //   loadChildren: './card-protect/card-protect.module#CardProtectModule'
      // },
      {
        path: 'blocked-funds',
        loadChildren: './blocked-funds/blocked-funds.module#BlockedFundsModule'
      },
      {
        path: 'card-replacement',
        loadChildren: './card-replacement/card-replacement.module#CardReplacementModule'
      },
      {
        path: 'virtual-card-request',
        loadChildren: './virtual-card-request/virtual-card-request.module#VirtualCardRequestModule'
      },
      {
        path: 'pin-retrieval',
        loadChildren: './pin-retrieval/pin-retrieval.module#PinRetrievalModule'
      },
      {
        path: 'card-statement',
        loadChildren: './card-statement/card-statement.module#CardStatementModule'
      },
      {
        path: 'dispense-error',
        loadChildren: './dispense-error/dispense-error.module#DispenseErrorModule'
      },
      {
        path: 'account-linking-delinking',
        loadChildren: './account-linking-delinking/account-linking-delinking.module#AccountLinkingDelinkingModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(cardsRoutes)],
  exports: [RouterModule]
})
export class CardsRoutingModule { }
