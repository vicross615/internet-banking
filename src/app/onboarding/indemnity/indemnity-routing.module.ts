import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {IndemnityComponent} from './indemnity.component';

const routes: Routes = [
  {
    path: '',
    component: IndemnityComponent,
    data: {
      title: 'Indemnity'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class IndemnityRoutingModule { }
