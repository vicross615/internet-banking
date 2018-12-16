import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRequireRoutingModule } from './i-require-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { IRequireComponent } from './i-require.component';

@NgModule({
  imports: [
    CommonModule,
    IRequireRoutingModule,
    SharedModule
  ],
  declarations: [IRequireComponent]
})
export class IRequireModule { }
