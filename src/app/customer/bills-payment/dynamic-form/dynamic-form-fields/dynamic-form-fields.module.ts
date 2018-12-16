import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormFieldsComponent } from './dynamic-form-fields.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [] // DynamicFormFieldsComponent
})
export class DynamicFormFieldsModule { }
