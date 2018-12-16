import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardProtectComponent } from './card-protect.component';

const routes: Routes = [
  {
    path: '',
    component: CardProtectComponent,
    data: {
      title: 'Card Protect',
      icon: 'icon-alert-triangle',
      caption: 'Card Protect',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardProtectRoutingModule { }
