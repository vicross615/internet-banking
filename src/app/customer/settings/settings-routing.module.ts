import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';



const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    data: {
      title: 'My Settings',
      icon: 'icon-cog',
      status: false
    },
    children: [
      {
        path: '',
        redirectTo: 'view-profile',
        pathMatch: 'full'
      },
      {
        path: 'password-reset',
        loadChildren: './password-reset/password-reset.module#PasswordResetModule'
      },
      {
        path: 'view-profile',
        loadChildren: './view-profile/view-profile.module#ViewProfileModule'
      },
      {
        path: 'gt-target',
        loadChildren: './gt-target/gt-target.module#GtTargetModule'
      },
      {
        path: 'i-require',
        loadChildren: './i-require/i-require.module#IRequireModule'
      },
      {
        path: 'we-fund',
        loadChildren: './we-fund/we-fund.module#WeFundModule'
      },
      {
        path: 'spend-to-save',
        loadChildren: './spend-to-save/spend-to-save.module#SpendToSaveModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(settingsRoutes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
