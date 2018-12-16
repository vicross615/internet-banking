import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ValidationFormComponent } from '../validation-form/validation-form.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ],
  declarations: [
    ProductsComponent,
    ValidationFormComponent
    ]
})
export class ProductsModule { }
