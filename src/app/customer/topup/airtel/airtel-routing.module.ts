import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirtelComponent } from './airtel.component';

const routes: Routes = [
  {
    path: '',
    component: AirtelComponent,
    data: {
      title: 'Airtel AirTime',
      icon: 'icon-corner-down-left',
      caption: 'Buy Airtel AirTime or Data',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirtelRoutingModule {}
