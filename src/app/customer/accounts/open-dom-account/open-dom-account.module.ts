import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenDomAccountRoutingModule } from './open-dom-account-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { OpenDomAccountComponent } from './open-dom-account.component';

@NgModule({
  imports: [
    CommonModule,
    OpenDomAccountRoutingModule,
    SharedModule
  ],
  declarations: [OpenDomAccountComponent]
})
export class OpenDomAccountModule { }
