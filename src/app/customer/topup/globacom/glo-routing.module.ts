import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GloComponent } from './glo.component';

const routes: Routes = [
  {
    path: '',
    component: GloComponent,
    data: {
      title: 'Glo AirTime',
      icon: 'icon-corner-down-left',
      caption: 'Buy Glo AirTime or Data',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GloRoutingModule {}
