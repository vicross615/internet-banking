import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-gtibank-minimalist-token-modal',
  templateUrl: './minimalist-token-modal.component.html',
  styleUrls: ['./minimalist-token-modal.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('500ms ease-in-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideUpDown', [
      state('in', style({ height: '*' })),
      transition('* => void', [
        style({ height: '*' }),
        animate('300ms', style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: 0 }),
        animate('300ms', style({ height: '*' }))
      ])
    ])
  ]
})
export class MinimalistTokenModalComponent implements OnInit {
  @ViewChild('token')
  private tokenValue;
  @Output()
  emitTokenEvent = new EventEmitter();
  @Output()
  clearEvent = new EventEmitter();
  @Input()
  message: any;
  @Input()
  activeService: string;
  @Input()
  isSuccess: boolean;
  @Input()
  isToken: boolean;
  @Input()
  isLoading: boolean;
  @Input()
  submited: boolean;
  constructor() {}
  ngOnInit() {}

  closeTokenForm() {
    this.clearEvent.emit();
  }

  submitToken() {
    let token_Value;
    if (this.isToken === true) {
      token_Value = this.tokenValue.nativeElement.value;
      this.emitTokenEvent.emit(token_Value);
    } else {
      this.emitTokenEvent.emit(null);
    }
  }
}
