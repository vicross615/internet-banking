import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillersListRoutingModule } from './billers-list-routing.module';
import { BillersListComponent } from './billers-list.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    BillersListRoutingModule,
  ],
  declarations: [BillersListComponent]
})
export class BillersListModule { }
