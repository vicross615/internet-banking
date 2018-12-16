import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  ChangeDetectionStrategy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Modal } from './modal.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-transfer-message-modal',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        width: '280px',
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        width: '0',
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ],
  templateUrl: './transfer-message-modal.component.html',
  styleUrls: ['./transfer-message-modal.component.scss'],
})
export class TransferMessageModalComponent implements OnChanges, OnInit {
  @Input() modal: Modal;

  constructor() { }

  ngOnInit() {
    console.log('Transfer Message Modal Initialized');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('OnChanges');
    console.log(JSON.stringify(changes));
    const change = changes.modal;
    console.log(`message changed from ${change.previousValue} to ${change.currentValue}`);
    switch (changes.modal.currentValue.type) {
      case 'transferMessage':
        this.openModal('#transferMessage');
        console.log(changes.modal.currentValue.messageType);
        console.log('onchanges initialized');
        break;

      default:
        break;
    }
  }

  closeAllModal() {
    document.querySelector('#transferMessage').classList.remove('md-show');
  }

  openModal(event) {
    document.querySelector(event).classList.add('md-show');
  }

  closeModal(event) {
    document.querySelector(event).classList.remove('md-show');
  }

}
