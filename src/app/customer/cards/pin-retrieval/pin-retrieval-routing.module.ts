import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PinRetrievalComponent } from './pin-retrieval.component';

const routes: Routes = [
  {
    path: '',
    component: PinRetrievalComponent,
    data: {
      title: 'Pin Retrieval',
      icon: 'icon-user',
      caption: 'Block your card in case',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PinRetrievalRoutingModule { }
