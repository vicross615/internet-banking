import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnAccountComponent } from './own-account.component';


const routes: Routes = [
  {
    path: '',
    component: OwnAccountComponent,
    data: {
      title: 'Own Account',
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
export class OwnAccountRoutingModule { }
