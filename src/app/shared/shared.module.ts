import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToggleFullScreenDirective} from './fullscreen/toggle-fullscreen.directive';
import {AccordionAnchorDirective} from './accordion/accordionanchor.directive';
import {AccordionLinkDirective} from './accordion/accordionlink.directive';
import {AccordionDirective} from './accordion/accordion.directive';
import {HttpClientModule} from '@angular/common/http';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {TitleComponent} from '../customer/title/title.component';
import { AcctDetailsComponent } from '../customer/accounts/acct-details/acct-details.component';
import {CardComponent} from './card/card.component';
import {CardToggleDirective} from './card/card-toggle.directive';
import {ModalBasicComponent} from './modal-basic/modal-basic.component';
import {ModalAnimationComponent} from './modal-animation/modal-animation.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {ClickOutsideModule} from 'ng-click-outside';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';
import { CurrencyMaskModule } from 'ngx-currency-mask';
import { IconsModule } from '../icons/icons.module';
import { TransferMessageModalComponent } from '../customer/transfers/transfer-message-modal/transfer-message-modal.component';
import { AccountsTypeaheadComponent } from '../customer/transfers/_directives/accounts-typeahead/accounts-typeahead.component';
import { TokenConfirmationModalComponent } from '../customer/transfers/token-confirmation-modal/token-confirmation-modal.component';
import { UniversalTypeaheadComponent } from './universal-typeahead/universal-typeahead.component';
import { FxAccountsTypeaheadComponent } from '../customer/transfers/_directives/fxAccounts-typeahead/fxAccounts-typeahead.component';
import { FrequentTransfersComponent } from '../customer/transfers/frequent-transfers/frequent-transfers.component';
import { PasswordResetFormComponent } from '../customer/settings/password-reset-form/password-reset-form.component';
import {
  PaymentHistoryCardsComponent
} from '../customer/bills-payment/payment-history/payment-history-cards/payment-history-cards.component';
import { GtTrackitComponent } from '../customer/gt-trackit/gt-trackit.component';
import { MinimalistTokenModalComponent } from './minimalist-token-modal/minimalist-token-modal.component';
import { ForgotSecretQuestionLinkComponent } from './forgot-secret-question-link/forgot-secret-question-link.component';
import { IbankNotificationsComponent } from './ibank-notifications/ibank-notifications.component';
import { FrequentTopupCompComponent } from './frequent-topup-comp/frequent-topup-comp.component';
import { DynamicFormFieldsComponent } from '../customer/bills-payment/dynamic-form/dynamic-form-fields/dynamic-form-fields.component';
import { DynamicFormComponent } from '../customer/bills-payment/dynamic-form/dynamic-form.component';





const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    ClickOutsideModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    NgbModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    NgxCarouselModule,
    CurrencyMaskModule,
    IconsModule
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionDirective,
    AccordionLinkDirective,
    AcctDetailsComponent,
    CardComponent,
    CardToggleDirective,
    ClickOutsideModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MDBBootstrapModule,
    ModalAnimationComponent,
    ModalBasicComponent,
    NgbModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    SpinnerComponent,
    TitleComponent,
    TransferMessageModalComponent,
    AccountsTypeaheadComponent,
    TokenConfirmationModalComponent,
    UniversalTypeaheadComponent,
    FxAccountsTypeaheadComponent,
    FrequentTransfersComponent,
    PaymentHistoryCardsComponent,
    GtTrackitComponent,
    ToggleFullScreenDirective,
    CurrencyMaskModule,
    IconsModule,
    PasswordResetFormComponent,
    MinimalistTokenModalComponent,
    FrequentTopupCompComponent,
    ForgotSecretQuestionLinkComponent,
    IbankNotificationsComponent,
    DynamicFormComponent,
    DynamicFormFieldsComponent
  ],
  declarations: [
    AccordionAnchorDirective,
    AccordionDirective,
    AccordionLinkDirective,
    AcctDetailsComponent,
    CardComponent,
    CardToggleDirective,
    ModalAnimationComponent,
    ModalBasicComponent,
    SpinnerComponent,
    TitleComponent,
    ToggleFullScreenDirective,
    TransferMessageModalComponent,
    TokenConfirmationModalComponent,
    AccountsTypeaheadComponent,
    UniversalTypeaheadComponent,
    FxAccountsTypeaheadComponent,
    FrequentTransfersComponent,
    PaymentHistoryCardsComponent,
    GtTrackitComponent,
    PasswordResetFormComponent,
    MinimalistTokenModalComponent,
    ForgotSecretQuestionLinkComponent,
    IbankNotificationsComponent,
    FrequentTopupCompComponent,
    DynamicFormComponent,
    DynamicFormFieldsComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class SharedModule { }
