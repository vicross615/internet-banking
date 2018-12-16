import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreRegisteredComponent } from './pre-registered.component';


const routes: Routes = [
  {
    path: '',
    component: PreRegisteredComponent,
    data: {
      title: 'Pre-Registered',
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
export class PreRegisteredRoutingModule { }
