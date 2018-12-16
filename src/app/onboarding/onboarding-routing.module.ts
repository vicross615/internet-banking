import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Onboarding',
      status: false
    },
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
      },
      {
        path: 'registration',
        loadChildren: './registration/registration.module#RegistrationModule'
      },
      {
        path: 'forgot',
        loadChildren: './forgot/forgot.module#ForgotModule'
      },
      {
        path: 'lock-screen',
        loadChildren: './lock-screen/lock-screen.module#LockScreenModule'
      },
      {
        path: 'logout',
        loadChildren: './logout/logout.module#LogoutModule'
      },
      {
        path: 'forgotsecret-question',
        loadChildren: './forgotsecret-question/forgotsecret-question.module#ForgotsecretQuestionModule'
      },
      {
        path: 'reset-password',
        loadChildren: './reset-password/reset-password.module#ResetPasswordModule'
      },
      {
        path: 'indemnity',
        loadChildren: './indemnity/indemnity.module#IndemnityModule'
      },
      {
        path: 'setsecret-question',
        loadChildren: './setsecret-question/setsecret-question.module#SetsecretQuestionModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
