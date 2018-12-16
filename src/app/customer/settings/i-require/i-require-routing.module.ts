import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IRequireComponent } from './i-require.component';

const routes: Routes = [
  {
    path: '',
    component: IRequireComponent,
    data: {
      title: 'I Require',
      icon: 'icon-corner-down-left',
      caption: 'Make Request for deliverables and pickup at our specified branch',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IRequireRoutingModule { }
