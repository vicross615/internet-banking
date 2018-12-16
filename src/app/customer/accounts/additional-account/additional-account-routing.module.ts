import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdditionalAccountComponent } from './additional-account.component';

const routes: Routes = [
  {
    path: '',
    component: AdditionalAccountComponent,
    data: {
      title: 'Add Additional Account',
      icon: 'icon-arrow-up',
      caption: 'Add an additional account to your account',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdditionalAccountRoutingModule { }
