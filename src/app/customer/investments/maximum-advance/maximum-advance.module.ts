import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaximumAdvanceComponent } from './maximum-advance.component';
import { MaximumAdvanceRoutingModule } from './maximum-advance-routing.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MaximumAdvanceRoutingModule,
    SharedModule,
  ],
  declarations: [MaximumAdvanceComponent]
})
export class MaximumAdvanceModule { }
