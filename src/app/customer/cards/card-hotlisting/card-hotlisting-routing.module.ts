import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardHotlistingComponent } from './card-hotlisting.component';

const routes: Routes = [
  {
    path: '',
    component: CardHotlistingComponent,
    data: {
      title: 'Card Hotlisting',
      icon: 'icon-alert-triangle',
      caption: 'Block your card in case of theft',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardHotlistingRoutingModule { }
