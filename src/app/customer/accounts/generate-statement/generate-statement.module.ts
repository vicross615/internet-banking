import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateStatementRoutingModule } from './generate-statement-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { GenerateStatementComponent } from './generate-statement.component';

@NgModule({
  imports: [
    CommonModule,
    GenerateStatementRoutingModule,
    SharedModule
  ],
  declarations: [GenerateStatementComponent]
})
export class GenerateStatementModule { }
