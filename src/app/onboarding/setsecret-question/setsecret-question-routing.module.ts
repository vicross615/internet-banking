import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SetsecretQuestionComponent} from './setsecret-question.component';

const routes: Routes = [
  {
    path: '',
    component: SetsecretQuestionComponent,
    data: {
      title: 'Indemnity'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})




export class SetsecretQuestionRoutingModule { }
