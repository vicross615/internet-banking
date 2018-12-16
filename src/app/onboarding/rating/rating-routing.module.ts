import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RatingComponent} from './rating.component';

const routes: Routes = [
  {
    path: '',
    component: RatingComponent,
    data: {
      title: 'Rating',
      icon: 'icon-crown',
      caption: 'How would you rate us today?',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RatingRoutingModule { }
