import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { FxRoutingModule } from './fx-routing.module';
import { FxComponent } from './fx.component';

@NgModule({
  imports: [
    CommonModule,
    FxRoutingModule,
    SharedModule
  ],
  declarations: [FxComponent]
})
export class FxModule { }
