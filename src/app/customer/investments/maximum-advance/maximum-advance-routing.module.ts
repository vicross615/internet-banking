import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '../../../../../node_modules/@angular/router';
import { MaximumAdvanceComponent } from './maximum-advance.component';

const routes: Routes = [
  {
    path: '',
    component: MaximumAdvanceComponent,
    data: {
      title: 'Max Advance',
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
export class MaximumAdvanceRoutingModule { }
