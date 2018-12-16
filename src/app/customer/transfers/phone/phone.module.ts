import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { PhoneComponent } from './phone.component';
import { PhoneRoutingModule } from './phone-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    PhoneRoutingModule,
    SharedModule,
    NgbModule
  ],
  declarations: [PhoneComponent]
})
export class PhoneModule { }
