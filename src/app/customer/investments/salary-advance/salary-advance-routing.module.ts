import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryAdvanceComponent } from './salary-advance.component';


const routes: Routes = [
  {
    path: '',
    component: SalaryAdvanceComponent,
    data: {
      title: 'Salary Advance',
      icon: 'icon-corner-down-left',
      caption: 'Send money to anyone. Its Quick and Easy',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryAdvanceRoutingModule { }
