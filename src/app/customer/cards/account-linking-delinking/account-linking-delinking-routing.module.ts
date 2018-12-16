import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountLinkingDelinkingComponent } from './account-linking-delinking.component';

const routes: Routes = [
  {
    path: '',
    component: AccountLinkingDelinkingComponent,
    data: {
      title: 'Account Linking/Delinking',
      icon: 'icon-alert-triangle',
      caption: 'Block your card in case of theft',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountLinkingDelinkingRoutingModule { }
