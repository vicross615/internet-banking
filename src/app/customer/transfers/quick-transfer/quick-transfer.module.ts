import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickTransferRoutingModule } from './quick-transfer-routing.module';
import { QuickTransferComponent } from './quick-transfer.component';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    QuickTransferRoutingModule,
    SharedModule
  ],
  declarations: [QuickTransferComponent]
})
export class QuickTransferModule { }
