import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardStatementComponent } from './card-statement.component';

const routes: Routes = [
  {
    path: '',
    component: CardStatementComponent,
    data: {
      title: 'Card Statement',
      icon: 'icon-alert-triangle',
      caption: 'View all your card transactions',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardStatementRoutingModule { }
