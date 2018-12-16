import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmileComponent } from './smile.component';
import { SharedModule } from '../../../shared/shared.module';
import { SmileRoutingModule } from './smile-routing.module';

@NgModule({
  imports: [CommonModule, SmileRoutingModule, SharedModule],
  declarations: [SmileComponent]
})
export class SmileModule {}
