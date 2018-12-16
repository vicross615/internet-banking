import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwiftComponent } from './swift.component';

const routes: Routes = [
  {
    path: '',
    component: SwiftComponent,
    data: {
      title: 'Swift AirTime',
      icon: 'icon-corner-down-left',
      caption: 'Buy Swift AirTime or Data',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SwiftRoutingModule {}
