import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ResetPasswordComponent} from './reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent,
    data: {
      title: 'Reset-Password'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ResetPasswordRoutingModule {
}
