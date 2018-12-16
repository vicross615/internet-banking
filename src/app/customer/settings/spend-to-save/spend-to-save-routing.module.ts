import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpendToSaveComponent } from './spend-to-save.component';

const routes: Routes = [
  {
    path: '',
    component: SpendToSaveComponent,
    data: {
      title: 'Spend2Save',
      icon: 'icon-corner-down-left',
      caption: 'Save cash while you spend. Create a Spend2Save account today',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpendToSaveRoutingModule { }
