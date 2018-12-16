import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {ViewProfileComponent} from './view-profile.component';


const routes: Routes = [
  {
    path: '',
    component: ViewProfileComponent,
    data: {
      title: 'View Profile',
      icon: 'icon-alert-triangle',
      caption: 'Block your card in case of theft',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    CommonModule],
  exports: [RouterModule],
  declarations: []
})

export class ViewProfileRoutingModule { }
