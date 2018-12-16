import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneComponent } from './phone.component';

const routes: Routes = [
  {
    path: '',
    component: PhoneComponent,
    data: {
      title: 'Phone',
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
export class PhoneRoutingModule { }
