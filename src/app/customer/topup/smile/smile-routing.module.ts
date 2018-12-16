import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmileComponent } from './smile.component';

const routes: Routes = [
  {
    path: '',
    component: SmileComponent,
    data: {
      title: 'Smile AirTime',
      icon: 'icon-corner-down-left',
      caption: 'Buy Smile AirTime or Data',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmileRoutingModule {}
