import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopupComponent } from './topup.component';

const routes: Routes = [
  {
    path: '',
    component: TopupComponent,
    data: {
      title: 'Airtime/Data Topup',
      icon: 'icon-share'
    },
    children: [
      {
        path: '',
        redirectTo: 'mtn',
        pathMatch: 'full'
      },
      {
        path: 'mtn',
        loadChildren: './mtn/mtn.module#MtnModule'
      },
      {
        path: 'airtel',
        loadChildren: './airtel/airtel.module#AirtelModule'
      },
      {
        path: 'nine-mobile',
        loadChildren: './nine-mobile/nine-mobile.module#NineMobileModule'
      },
      {
        path: 'globacom',
        loadChildren: './globacom/glo.module#GloModule'
      },
      /*
      {
        path: 'swift',
        loadChildren: './swift/swift.module#SwiftModule'
      },
      {
        path: 'smile',
        loadChildren: './smile/smile.module#SmileModule'
      }, */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopupRoutingModule { }
