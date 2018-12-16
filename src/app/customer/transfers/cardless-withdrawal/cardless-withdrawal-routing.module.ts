import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardlessWithdrawalComponent } from './cardless-withdrawal.component';



const routes: Routes = [
  {
    path: '',
    component: CardlessWithdrawalComponent,
    data: {
      title: 'Cardless Withdrawal',
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
export class CardlessWithdrawalRoutingModule { }
