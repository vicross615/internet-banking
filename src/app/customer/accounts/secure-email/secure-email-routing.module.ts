import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecureEmailComponent } from './secure-email.component';

const routes: Routes = [
  {
    path: '',
    component: SecureEmailComponent,
    data: {
      title: 'Secure Email',
      icon: 'icon-send',
      caption: 'Create a request using a secured email channel',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureEmailRoutingModule { }
