import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesListComponent } from './categories-list.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesListComponent,
    data: {
      title: 'Categories',
      icon: 'icon-corner-down-left',
      caption: 'Select a category',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesListRoutingModule { }
