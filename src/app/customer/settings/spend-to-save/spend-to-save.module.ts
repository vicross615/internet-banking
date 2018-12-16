import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpendToSaveRoutingModule } from './spend-to-save-routing.module';
import { SpendToSaveComponent } from './spend-to-save.component';

@NgModule({
  imports: [
    CommonModule,
    SpendToSaveRoutingModule
  ],
  declarations: [SpendToSaveComponent]
})
export class SpendToSaveModule { }
