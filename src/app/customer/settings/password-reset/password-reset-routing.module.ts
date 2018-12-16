import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {PasswordResetComponent} from './password-reset.component'



const routes: Routes = [
  {
    path: '',
    component: PasswordResetComponent,
    data: {
      title: 'Password Reset',
     // icon: 'icon-alert-triangle',
     // caption: 'Block your card in case of theft',
      //status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PasswordResetRoutingModule { }
