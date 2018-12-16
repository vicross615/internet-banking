import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopupRoutingModule } from './topup-routing.module';
import { TopupComponent } from './topup.component';
import { SelectModule } from 'ng-select';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    TopupRoutingModule,
    SelectModule,
    SharedModule
  ],
  declarations: [TopupComponent]
})
export class TopupModule { }
