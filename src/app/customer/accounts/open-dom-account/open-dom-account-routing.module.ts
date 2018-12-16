import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpenDomAccountComponent } from './open-dom-account.component';

const routes: Routes = [
  {
    path: '',
    component: OpenDomAccountComponent,
    data: {
      title: 'Open Dom Account',
      icon: 'icon-plus',
      caption: 'Open a new Domiciliary Account',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenDomAccountRoutingModule { }
