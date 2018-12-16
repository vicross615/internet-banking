import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillsPaymentComponent } from './bills-payment.component';

const paymentsRoutes: Routes = [
  {
    path: '',
    component: BillsPaymentComponent,
    data: {
      title: 'Bills Payment',
      icon: 'icon-tv',
      status: false
    },
    children: [
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full'
      },
      {
        path: 'categories',
        loadChildren: './categories-list/categories-list.module#CategoriesListModule'
      },
      {
        path: 'category/:categoryName/:categoryId',
        loadChildren: './billers-list/billers-list.module#BillersListModule'
      },
      {
        path: 'biller/:billerName/:billerId',
        loadChildren: './products/products.module#ProductsModule'
      },
      {
        path: 'payment-history',
        loadChildren: './payment-history/payment-history.module#PaymentHistoryModule'
      },
      // {
      //   path: 'form',
      //   loadChildren: './form/form.module#FormModule'
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(paymentsRoutes)],
  exports: [RouterModule]
})
export class BillsPaymentRoutingModule { }
