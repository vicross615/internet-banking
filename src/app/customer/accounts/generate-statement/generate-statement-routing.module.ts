import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateStatementComponent } from './generate-statement.component';

const routes: Routes = [
  {
    path: '',
    component: GenerateStatementComponent,
    data: {
      title: 'Generate Statement',
      icon: 'icon-file',
      caption: 'Generate Statement and send to third party',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateStatementRoutingModule { }
