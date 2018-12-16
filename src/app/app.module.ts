import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './_services/interceptor.service';
// import { HttpModule } from '@angular/http';
import {NgxCarouselModule} from 'ngx-carousel';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerComponent } from './customer/customer.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { AlertComponent } from './_directives/alert/alert.component';
import {SharedModule} from './shared/shared.module';
// import {MenuItems} from './shared/menu-items/menu-items';
import {BreadcrumbsComponent} from './customer/breadcrumbs/breadcrumbs.component';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { CurrencyPipe } from '@angular/common';
import { SessionTimeoutModalComponent } from './session-timeout-modal/session-timeout-modal.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
// import { MomentModule } from 'angular2-moment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxAnalyticsModule } from 'ngx-analytics';
import { NgxAnalyticsGoogleAnalytics } from 'ngx-analytics/ga';

// Config imports
@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    OnboardingComponent,
    BreadcrumbsComponent,
    AlertComponent,
    SessionTimeoutModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    // MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    SharedModule,
    NgbModule.forRoot(),
    NgxCarouselModule,
    AppRoutingModule,
    NgxAnalyticsModule.forRoot([NgxAnalyticsGoogleAnalytics])
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [
    NotificationsService,
    CurrencyPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
