import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvestmentsComponent } from './investments.component';

const InvestmentRoutes: Routes = [
  {
    path: '',
    component: InvestmentsComponent,
    data: {
      title: 'Investments and Loans',
      icon: 'icon-briefcase',
      status: false
    },
    children: [
      {
        path: '',
        redirectTo: 'salary-advance',
        pathMatch: 'full'
      },
      {
        path: 'salary-advance',
        loadChildren: './salary-advance/salary-advance.module#SalaryAdvanceModule'
      },
      {
        path: 'maximum-advance',
        loadChildren: './maximum-advance/maximum-advance.module#MaximumAdvanceModule'
      },
      {
        path: 'school-fees-advance',
        loadChildren: './school-fees-advance/school-fees-advance.module#SchoolFeesAdvanceModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(InvestmentRoutes)],
  exports: [RouterModule]
})
export class InvestmentsRoutingModule { }
