import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardReplacementComponent } from './card-replacement.component';

const routes: Routes = [
  {
    path: '',
    component: CardReplacementComponent,
    data: {
      title: 'Card Replacement',
      icon: 'icon-alert-triangle',
      caption: 'Card Replacement',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardReplacementRoutingModule { }
