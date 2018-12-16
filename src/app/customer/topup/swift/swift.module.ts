import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiftComponent } from './swift.component';
import { SharedModule } from '../../../shared/shared.module';
import { SwiftRoutingModule } from './swift-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SwiftRoutingModule,
    SharedModule
  ],
  declarations: [SwiftComponent]
})
export class SwiftModule { }
