import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NineMobileComponent } from './nine-mobile.component';

const routes: Routes = [
  {
    path: '',
    component: NineMobileComponent,
    data: {
      title: 'MTN AirTime',
      icon: 'icon-corner-down-left',
      caption: 'Buy MTN AirTime or Data',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NineMobileRoutingModule {}
