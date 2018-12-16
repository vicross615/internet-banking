import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesListRoutingModule } from './categories-list-routing.module';
import { CategoriesListComponent } from './categories-list.component';

@NgModule({
  imports: [
    CommonModule,
    CategoriesListRoutingModule,
  ],
  declarations: [CategoriesListComponent]
})
export class CategoriesListModule { }
