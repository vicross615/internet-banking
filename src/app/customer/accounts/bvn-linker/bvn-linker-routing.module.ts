import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BvnLinkerComponent } from './bvn-linker.component';

const routes: Routes = [
  {
    path: '',
    component: BvnLinkerComponent,
    data: {
      title: 'BVN Linker',
      icon: 'icon-file',
      caption: 'Link your BVN to an account',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BvnLinkerRoutingModule { }
