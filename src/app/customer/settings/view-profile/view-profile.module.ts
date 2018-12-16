import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ViewProfileComponent } from './view-profile.component';
import { ViewProfileRoutingModule } from './view-profile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ViewProfileRoutingModule,
    SharedModule
  ],
  declarations: [ViewProfileComponent]
})
export class ViewProfileModule { }
