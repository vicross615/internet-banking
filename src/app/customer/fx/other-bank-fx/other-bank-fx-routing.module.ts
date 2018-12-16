import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtherBankFxComponent } from './other-bank-fx.component';

const routes: Routes = [
  {
    path: '',
    component: OtherBankFxComponent,
    data: {
      title: 'Other Bank Fx Transfer',
      icon: 'icon-alert-triangle',
      caption: 'other bank fx transfer',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherBankFxRoutingModule { }
