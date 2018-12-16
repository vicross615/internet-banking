import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { MenuItems } from '../shared/menu-items/menu-items';
import { Router } from '@angular/router';
import { User } from '../_models/user';

import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { UtilitiesService } from '../_services/utilities.service';
import { NotificationsService } from 'angular2-notifications';
import { AcctManagerService } from '../_services/acct-manager.service';
import { AcctMngrResponse, StaffPicture, StaffDetails } from '../_models/account-manager';
import { CustomerService } from './_customer-service/customer.service';
import { AcctToDebitResponse, AcctToDebit, AcctDetails, Notifications } from './_customer-model/customer.model';
import { Idle, EventTargetInterruptSource, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import 'rxjs/add/operator/takeWhile';
import { takeWhile } from 'rxjs/operators';
import { CardsService } from './cards/cards.service';
import { BillsPaymentService } from './bills-payment/_services/bills-payment.service';
import { GtNotificationsService } from './notifications/notifications.service';
import { GenerateStatementService } from './accounts/generate-statement/generate-statement.service';
import { Cards } from './cards/cards.model';
import { AirtimeDataService } from './topup/airtime-data.service';
import { BankName } from '../../app/customer/cards/dispense-error/dispense-error.model';
import { DispenseErrorService } from '../customer/cards/dispense-error/dispense-error.service';

import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  animations: [
    trigger('notificationBottom', [
      state('an-off, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('an-animate',
        style({
          overflow: 'visible',
          height: AUTO_STYLE,
        })
      ),
      transition('an-off <=> an-animate', [
        animate('400ms ease-in-out')
      ])
    ]),
    trigger('slideInOut', [
      state('in', style({
        width: '280px',
        // transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        width: '0',
        // transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
    trigger('mobileHeaderNavRight', [
      state('nav-off, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('nav-on',
        style({
          height: AUTO_STYLE,
        })
      ),
      transition('nav-off <=> nav-on', [
        animate('400ms ease-in-out')
      ])
    ]),
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('mobileMenuTop', [
      state('no-block, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('yes-block',
        style({
          height: AUTO_STYLE,
        })
      ),
      transition('no-block <=> yes-block', [
        animate('400ms ease-in-out')
      ])
    ])
  ]
})
export class CustomerComponent implements OnInit, AfterViewInit, OnDestroy {
  // session management properties
  idleState = 'NOT_STARTED';
  timedOut = true;
  lastPing?: Date = null;
  count: number;
  countMinutes: number;
  countSeconds: number;
  progressCount: number;
  closeTimeOutModal = false;
  srcUrl: string;
  email: string;
  fullName: string;
  phoneNumber: string;


  randomNumber: number;
  user: User;
  displayName: string;
  public acctToDebit: Array<AcctToDebit> = [];
  acctToDebitFX: any;
  acctDetails: AcctDetails[] = [];
  public bankName: BankName[];
  public acctOfficer: AcctMngrResponse;
  public staffDetails: StaffDetails;
  public staffPics: StaffPicture;
  public animateSidebar: string;
  public navType: string;
  public themeLayout: string;
  public verticalPlacement: string;
  public verticalLayout: string;
  public pcodedDeviceType: string;
  public verticalNavType: string;
  public verticalEffect: string;
  public vnavigationView: string;
  public freamType: string;
  public sidebarImg: string;
  public sidebarImgType: string;
  public layoutType: string;
  public branchArray: string[];
  public branchLocation: string;

  public headerTheme: string;
  public pcodedHeaderPosition: string;

  public gtNotifications: Notifications[];
  public gtNotificationsError: string;

  public liveNotification: string;
  public liveNotificationClass: string;

  public profileNotification: string;
  public profileNotificationClass: string;

  public chatSlideInOut: string;
  public innerChatSlideInOut: string;

  public searchWidth: number;
  public searchWidthString: string;

  public navRight: string;
  public windowWidth: number;
  public chatTopPosition: string;

  public toggleOn: boolean;
  public toggleIcon: string;
  public navBarTheme: string;
  public activeItemTheme: string;
  public pcodedSidebarPosition: string;

  public headerFixedTop: string;

  public menuTitleTheme: string;
  public dropDownIcon: string;
  public subItemIcon: string;

  public configOpenRightBar: string;
  public displayBoxLayout: string;
  public isVerticalLayoutChecked: boolean;
  public isSidebarChecked: boolean;
  public isHeaderChecked: boolean;
  public headerFixedMargin: string;
  public sidebarFixedHeight: string;
  public sidebarFixedNavHeight: string;
  public itemBorderStyle: string;
  public subItemBorder: boolean;
  public itemBorder: boolean;

  public isCollapsedSideBar: string;
  public psDisabled: string;
  public perfectDisable: string;

  public config: any;
  cards: Cards[];
  selectedCards: Cards;
  cardsErr: string;

  public options: any = {
    position: ['bottom', 'right'],
  };

  // public user: User = this.user[''];

  scroll = (): void => {
    const scrollPosition = window.pageYOffset;
    if (scrollPosition > 50) {
      if (this.isSidebarChecked === true) {
        this.pcodedSidebarPosition = 'fixed';
      }
      this.headerFixedTop = '0';
      this.sidebarFixedNavHeight = '100%';
    } else {
      this.headerFixedTop = 'auto';
      this.pcodedSidebarPosition = 'absolute';
      this.sidebarFixedNavHeight = '';
    }
  }


  // FOR YOU: TO REDIRECT USER
  redirect(url) {
    window.open(url);
  }

  constructor(
    public notifications: NotificationsService,
    public gtNotificationsService: GtNotificationsService,
    public menuItems: MenuItems,
    private router: Router,
    private userService: UserService,
    private auth: AuthService,
    private AMS: AcctManagerService,
    private customerService: CustomerService,
    private cardsService: CardsService,
    private billsPaymentService: BillsPaymentService,
    private element: ElementRef,
    private idle: Idle,
    private keepalive: Keepalive,
    private statementService: GenerateStatementService,
    private dispenseErrorService: DispenseErrorService,
    private airtime_DataService: AirtimeDataService
  ) {
    // Session management functions

    // sets an idle timeout of 30mins
    idle.setIdle(900);
    // sets a timeout  period of 5mins
    idle.setTimeout(60);
    // sets the interrupts like keydown, scroll, mouse wheel, mouse down, and etc
    idle.setInterrupts(
      [
        new EventTargetInterruptSource(
          this.element.nativeElement, 'keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll'
        )
      ]
    );
    idle.onIdleEnd
      .takeWhile(() => !this.timedOut)
      .subscribe(
        () => { this.idleState = 'NO_LONGER_IDLE'; }
      );

    idle.onTimeout.subscribe(
      () => {
        this.idleState = 'TIMED_OUT';
        this.timedOut = true;
        this.router.navigate(['/onboarding/logout']);
        console.log(this.idleState);
      }
    );

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'IDLE_START';
      console.log(this.idleState);
    });

    idle.onTimeoutWarning.subscribe((countdown: any) => {
      this.idleState = 'IDLE_TIME_IN_PROGRESS';
      this.count = (Math.floor((countdown - 1) / 60) + 1);
      this.progressCount = this.reverseNumber(countdown);
      this.countMinutes = (Math.floor(countdown / 60));
      this.countSeconds = countdown % 60;
      console.log(this.idleState);
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);
    /**
     *  // Keepalive can ping request to an HTTP location to keep server session alive
     * keepalive.request('<String URL>' or HTTP Request);
     * // Keepalive ping response can be read using below option
     * keepalive.onPing.subscribe(response => {
     * // Redirect user to logout screen stating session is timeout out if if response.status != 200
     * });
     */

    this.reset();
    this.animateSidebar = '';
    this.navType = 'st2';
    this.themeLayout = 'vertical';
    this.verticalPlacement = 'left';
    this.verticalLayout = 'wide';
    this.pcodedDeviceType = 'desktop';
    this.verticalNavType = 'expanded';
    this.verticalEffect = 'shrink';
    this.vnavigationView = 'view1';
    this.freamType = 'theme6';
    this.sidebarImg = 'false';
    this.sidebarImgType = 'img1';
    this.layoutType = 'light'; // light(default) dark(dark)

    this.headerTheme = 'theme1'; // theme1(default)
    this.pcodedHeaderPosition = 'relative'; // fixed

    this.headerFixedTop = 'auto';

    this.liveNotification = 'an-off';
    this.profileNotification = 'an-off';

    this.chatSlideInOut = 'out';
    this.innerChatSlideInOut = 'out';

    this.searchWidth = 0;

    this.navRight = 'nav-on';

    this.windowWidth = window.innerWidth;
    this.setHeaderAttributes(this.windowWidth);

    this.toggleOn = true;
    this.toggleIcon = 'icon-x';
    this.navBarTheme = 'theme1'; // themelight1(default) theme1(dark)
    this.activeItemTheme = 'theme1';
    this.pcodedSidebarPosition = 'fixed'; // absolute
    this.menuTitleTheme = 'theme1'; // theme1(default) theme10(dark)
    this.dropDownIcon = 'style1';
    this.subItemIcon = 'style1';

    this.displayBoxLayout = 'd-none';
    this.isVerticalLayoutChecked = false;
    this.isSidebarChecked = false;
    this.isHeaderChecked = false;
    this.headerFixedMargin = '50px'; // 50px
    this.sidebarFixedHeight = '100%'; // calc(100vh - 190px)
    this.itemBorderStyle = 'none';
    this.subItemBorder = true;
    this.itemBorder = true;

    this.isCollapsedSideBar = 'no-block';

    this.perfectDisable = '';

    this.setMenuAttributes(this.windowWidth);
    this.setHeaderAttributes(this.windowWidth);
  }

  ngOnInit() {
    this.setBackgroundPattern('theme1');
    this.user = this.userService.getUserDetails();
    // Display name function
    const n = this.user.userFullName.split(' ');
    this.displayName = n[1];
    this.showAcctMngr();
    this.customerService.getAcctToDebitData();
    this.customerService.getAcctDetailsData();
    this.customerService.getAcctToDebitFXData();
    this.billsPaymentService.getCollectionsData();
    this.billsPaymentService.getCategoriesData();
    this.cardsService.getCardStatusData();
    this.gtNotificationsService.getNotifiactionsData();
    this.statementService.getDestinationListData('1');
    this.customerService.getPreRegBeneficiariesData();
    this.customerService.getBeneficiariesData('ALL');
    this.dispenseErrorService.getAcctToDipErrorLocation();
    setTimeout(() => {
      this.dispenseErrorService.banks$.subscribe(bankName => this.bankName = bankName);
      this.customerService.acctToDebit$.pipe(untilComponentDestroyed(this))
        .subscribe(accts => this.acctToDebit = accts);
      this.customerService.acctDetail$.pipe(untilComponentDestroyed(this))
        .subscribe(accts => this.acctDetails = accts);
      this.customerService.acctToDebitFX$.pipe(untilComponentDestroyed(this))
        .subscribe(fxacct => this.acctToDebitFX = fxacct);
      this.customerService.beneficiaries$.subscribe();
      this.customerService.preRegBeneficiaries$.subscribe();
      this.billsPaymentService.collections$.subscribe();
      this.billsPaymentService.categories$.subscribe();
      this.cardsService.cards$.pipe(untilComponentDestroyed(this))
        .subscribe(cards => {
          this.cards = cards; console.log(this.cards);
        });
      this.cardsService.selectedCard$.pipe(untilComponentDestroyed(this))
        .subscribe(card => {
          this.selectedCards = card; console.log(this.selectedCards);
        });
      this.cardsService.cardsError$.pipe(untilComponentDestroyed(this))
        .subscribe(err => {
          this.cardsErr = err; console.log(this.cardsErr);
        });
    }, 500);

    setTimeout(() => {
      this.airtime_DataService.initializeRecentTransfersDataStream();
    }, 5000);
    this.updateAcctsToDebit();
    /*document.querySelector('body').classList.remove('dark');*/
    this.getNotifications();

  }

  ngAfterViewInit() {
    this.updateAcctsToDebit();
  }

  // Session Management
  ngOnDestroy() {
    this.timedOut = true;
    // this.resetTimeOut();
  }

  reverseNumber(countdown: number) {
    return (300 - (countdown - 1));
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  onClick(response: boolean) {
    console.log('User response from App Component: ' + response);
    response ? this.reset() : this.Logout();
  }

  resetTimeOut() {
    this.idle.stop();
    this.idle.onIdleStart.unsubscribe();
    this.idle.onTimeoutWarning.unsubscribe();
    this.idle.onIdleEnd.unsubscribe();
    this.idle.onIdleEnd.unsubscribe();
  }

  updateAcctsToDebit() {
    this.customerService.updateAcctToDebit(this.acctToDebit);
  }

  onResize(event) {
    this.windowWidth = event.target.innerWidth;
    this.setHeaderAttributes(this.windowWidth);

    let reSizeFlag = true;
    if (this.pcodedDeviceType === 'tablet' && this.windowWidth >= 768 && this.windowWidth <= 1024) {
      reSizeFlag = false;
    } else if (this.pcodedDeviceType === 'mobile' && this.windowWidth < 768) {
      reSizeFlag = false;
    }
    /* for check device */
    if (reSizeFlag) {
      this.setMenuAttributes(this.windowWidth);
    }
  }

  setHeaderAttributes(windowWidth) {
    if (windowWidth < 992) {
      this.navRight = 'nav-off';
    } else {
      this.navRight = 'nav-on';
    }
  }

  setMenuAttributes(windowWidth) {
    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.pcodedDeviceType = 'tablet';
      this.verticalNavType = 'offcanvas'; // expanded
      this.verticalEffect = 'overlay'; // shrink
      this.toggleIcon = 'icon-menu';
      this.headerFixedTop = '50px';
    } else if (windowWidth < 768) {
      this.pcodedDeviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'overlay';
      this.toggleIcon = 'icon-menu';
    } else {
      this.pcodedDeviceType = 'desktop';
      this.verticalNavType = 'expanded';
      this.verticalEffect = 'shrink';
      this.toggleIcon = 'icon-x';
    }
  }

  toggleHeaderNavRight() {
    this.navRight = this.navRight === 'nav-on' ? 'nav-off' : 'nav-on';
    this.chatTopPosition = this.chatTopPosition === 'nav-on' ? '112px' : '';
    if (this.navRight === 'nav-off' && this.innerChatSlideInOut === 'in') {
      this.toggleInnerChat();
    }
    if (this.navRight === 'nav-off' && this.chatSlideInOut === 'in') {
      this.toggleChat();
    }
  }



  toggleChat() {
    if (this.innerChatSlideInOut === 'in') {
      this.innerChatSlideInOut = 'out';
    } else {
      this.chatSlideInOut = this.chatSlideInOut === 'out' ? 'in' : 'out';
    }
  }

  toggleInnerChat() {
    this.innerChatSlideInOut = this.innerChatSlideInOut === 'out' ? 'in' : 'out';
  }

  searchOn() {
    document.querySelector('#main-search').classList.add('open');
    const searchInterval = setInterval(() => {
      if (this.searchWidth >= 200) {
        clearInterval(searchInterval);
        return false;
      }
      this.searchWidth = this.searchWidth + 15;
      this.searchWidthString = this.searchWidth + 'px';
    }, 35);
  }

  searchOff() {
    const searchInterval = setInterval(() => {
      if (this.searchWidth <= 0) {
        document.querySelector('#main-search').classList.remove('open');
        clearInterval(searchInterval);
        return false;
      }
      this.searchWidth = this.searchWidth - 15;
      this.searchWidthString = this.searchWidth + 'px';
    }, 35);
  }

  toggleOpened(e) {
    if (this.windowWidth < 1024) {
      this.toggleOn = this.verticalNavType === 'offcanvas' ? true : this.toggleOn;
      if (this.navRight === 'nav-on') {
        this.toggleHeaderNavRight();
      }
      this.verticalNavType = this.verticalNavType === 'expanded' ? 'offcanvas' : 'expanded';
    } else {
      this.verticalNavType = this.verticalNavType === 'expanded' ? 'collapsed' : 'expanded';
    }
    this.toggleIcon = this.verticalNavType === 'expanded' ? 'icon-x' : 'icon-menu';
    this.animateSidebar = 'pcoded-toggle-animate';

    if (this.verticalNavType === 'collapsed') {
      this.perfectDisable = 'disabled';
      this.sidebarFixedHeight = '100%';
    } else {
      this.perfectDisable = '';
    }

    if (this.verticalNavType === 'collapsed' && this.isHeaderChecked === false) {
      this.setSidebarPosition();
    }

    setTimeout(() => {
      this.animateSidebar = '';
    }, 500);
  }

  onClickedOutsideSidebar(e: Event) {
    if ((this.windowWidth < 992 && this.toggleOn && this.verticalNavType !== 'offcanvas') || this.verticalEffect === 'overlay') {
      this.toggleOn = true;
      this.verticalNavType = 'offcanvas';
      this.toggleIcon = 'icon-menu';
    }
  }

  toggleRightbar() {
    this.configOpenRightBar = this.configOpenRightBar === 'open' ? '' : 'open';
  }

  setNavBarTheme(theme: string) {
    if (theme === 'themelight1') {
      this.navBarTheme = 'themelight1';
      this.menuTitleTheme = 'theme1';
      this.sidebarImg = 'false';
    } else {
      this.menuTitleTheme = 'theme9';
      this.navBarTheme = 'theme1';
      this.sidebarImg = 'flase';
    }
  }

  setLayoutType(type: string) {
    if (type === 'dark') {
      this.layoutType = type;
      this.headerTheme = 'theme6';
      this.sidebarImg = 'false';
      this.navBarTheme = 'theme1';
      this.menuTitleTheme = 'theme9';
      this.freamType = 'theme6';
      document.querySelector('body').classList.add('dark');
      this.setBackgroundPattern('theme6');
      this.activeItemTheme = 'theme1';
    } else if (type === 'light') {
      this.layoutType = type;
      this.sidebarImg = 'false';
      this.headerTheme = 'theme1';
      this.navBarTheme = 'themelight1';
      this.menuTitleTheme = 'theme1';
      this.freamType = 'theme1';
      document.querySelector('body').classList.remove('dark');
      this.setBackgroundPattern('theme1');
      this.activeItemTheme = 'theme1';
    } else if (type === 'img') {
      this.sidebarImg = 'true';
      this.navBarTheme = 'themelight1';
      this.menuTitleTheme = 'theme1';
      this.freamType = 'theme1';
      document.querySelector('body').classList.remove('dark');
      this.setBackgroundPattern('theme1');
      this.activeItemTheme = 'theme1';
    }
  }

  setVerticalLayout() {
    this.isVerticalLayoutChecked = !this.isVerticalLayoutChecked;
    if (this.isVerticalLayoutChecked) {
      this.verticalLayout = 'box';
      this.displayBoxLayout = '';
    } else {
      this.verticalLayout = 'wide';
      this.displayBoxLayout = 'd-none';
    }
  }

  setBackgroundPattern(pattern: string) {
    document.querySelector('body').setAttribute('themebg-pattern', pattern);
    // this.menuTitleTheme = this.freamType = this.activeItemTheme = this.headerTheme = pattern;
  }

  setSidebarPosition() {
    if (this.verticalNavType !== 'collapsed') {
      this.isSidebarChecked = !this.isSidebarChecked;
      this.pcodedSidebarPosition = this.isSidebarChecked === true ? 'fixed' : 'absolute';
      this.sidebarFixedHeight = this.isSidebarChecked === true ? 'calc(100vh - 390px)' : '100%';
      if (this.isHeaderChecked === false) {
        window.addEventListener('scroll', this.scroll, true);
        window.scrollTo(0, 0);
      }
    }
  }

  setHeaderPosition() {
    this.isHeaderChecked = !this.isHeaderChecked;
    this.pcodedHeaderPosition = this.isHeaderChecked === true ? 'fixed' : 'relative';
    this.headerFixedMargin = this.isHeaderChecked === true ? '50px' : '';
    if (this.isHeaderChecked === false) {
      window.addEventListener('scroll', this.scroll, true);
      window.scrollTo(0, 0);
    } else {
      window.removeEventListener('scroll', this.scroll, true);
      this.headerFixedTop = 'auto';
      this.pcodedSidebarPosition = 'fixed';
      if (this.verticalNavType !== 'collapsed') {
        this.sidebarFixedHeight = this.isSidebarChecked === true ? 'calc(100vh - 375px)' : 'calc(100vh + 375px)';
      }
    }
  }

  toggleOpenedSidebar() {
    this.isCollapsedSideBar = this.isCollapsedSideBar === 'yes-block' ? 'no-block' : 'yes-block';
    if (this.verticalNavType !== 'collapsed') {
      this.sidebarFixedHeight = this.isCollapsedSideBar === 'yes-block' ? 'calc(100vh - 300px)' : 'calc(100vh - 390px)';
    }
  }

  /* generateNumber() {
    this.randomNumber = Math.floor(Math.random() * (999999999 - 10000000 + 1) + 10000000);
  } */

  Logout() {
    this.router.navigate(['/onboarding/logout']);
  }

  public showAcctMngr() {
    this.acctOfficer = JSON.parse(localStorage.getItem('acctOfficer'));
    this.AMS.getAcctManagerDetails()
      .pipe(untilComponentDestroyed(this))
      .subscribe(
        (res: AcctMngrResponse) => {
          // Remove this before production
          console.log(res);
          if (res.responseCode === '00') {
            // disable switch button
            this.acctOfficer = res;
            if (this.acctOfficer.staffDetails == null || this.acctOfficer.staffPicture == null) {
              this.srcUrl = 'assets/images/user-card/AcctMgr.png';
              console.log(this.srcUrl);
              // this.branchLocation = '999';
              this.phoneNumber = '08029002900';
              this.email = 'gtconnect@gtbank.com';
              this.fullName = 'GTCONNECT';
            } else {
              this.srcUrl = 'data:' + this.acctOfficer.staffPicture.mimeType + ';base64,' + this.acctOfficer.staffPicture.photo;
              console.log(this.srcUrl);
              if (this.acctOfficer.staffDetails.branchLocation == null) {
                this.branchArray = [];
              } else {
                this.branchArray = this.acctOfficer.staffDetails.branchLocation.split('(');
              }
              this.branchLocation = this.branchArray[0];
              this.phoneNumber = this.acctOfficer.staffDetails.phoneNumber;
              this.email = this.acctOfficer.staffDetails.email;
              this.fullName = this.acctOfficer.staffDetails.fullName;

            }
          } else {

          }
          console.log(this.srcUrl);
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
  }


  getNotifications() {
    console.log('Notifications');
    this.gtNotificationsService.notifications$.pipe(untilComponentDestroyed(this))
      .subscribe(n => this.gtNotifications = n);
  }

  doNotificationAction(n: Notifications) {
    console.log('do notifications');
    if (n.nextAction !== ' ') {
      this.router.navigate([n.nextAction]);
    }
  }

}
