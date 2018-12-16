import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { SetsecretQuestionComponent } from './setsecret-question.component';
import {SetsecretQuestionRoutingModule} from './setsecret-question-routing.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SetsecretQuestionRoutingModule
  ],
  declarations: [SetsecretQuestionComponent]
})
export class SetsecretQuestionModule {}
