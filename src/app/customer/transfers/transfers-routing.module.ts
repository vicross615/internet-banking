import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { TransfersComponent } from './transfers.component';

const transfersRoutes: Routes = [
    {
        path: '',
        component: TransfersComponent,
        data: {
            title: 'Transfers',
            icon: 'feather icon-corner-down-left',
            status: false
        },
        children: [
            {
                path: '',
                redirectTo: 'GTBank',
                pathMatch: 'full'
            },
            {
                path: 'beneficiaries',
                loadChildren: './beneficiaries/beneficiaries.module#BeneficiariesModule'
            },
            {
                path: 'cardless-withdrawal',
                loadChildren: './cardless-withdrawal/cardless-withdrawal.module#CardlessWithdrawalModule'
            },
            {
                path: 'cash-in-transit',
                loadChildren: './cash-in-transit/cash-in-transit.module#CashInTransitModule'
            },
            {
                path: 'draft-in-transit',
                loadChildren: './draft-in-transit/draft-in-transit.module#DraftInTransitModule'
            },
            {
                path: 'GTBank',
                loadChildren: './gt-transfers/gt-transfers.module#GtTransfersModule'
            },
            {
                path: 'other-banks',
                loadChildren: './other-banks/other-banks.module#OtherBanksModule'
            },
            {
                path: 'own-account',
                loadChildren: './own-account/own-account.module#OwnAccountModule'
            },
            {
                path: 'phone',
                loadChildren: './phone/phone.module#PhoneModule'
            },
            {
                path: 'pre-registered',
                loadChildren: './pre-registered/pre-registered.module#PreRegisteredModule'
            },
            {
                path: 'standing-order',
                loadChildren: './standing-order/standing-order.module#StandingOrderModule'
            },
            {
                path: 'quick-transfer',
                loadChildren: './quick-transfer/quick-transfer.module#QuickTransferModule'
            },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(transfersRoutes)],
  exports: [RouterModule]
})
export class TransfersRoutingModule { }
