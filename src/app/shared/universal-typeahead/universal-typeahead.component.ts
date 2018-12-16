import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, merge } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map
} from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
import { FormControl } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-universal-typeahead',
  templateUrl: './universal-typeahead.component.html',
  styleUrls: ['./universal-typeahead.component.scss'],
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
    ])
  ]
})
export class UniversalTypeaheadComponent implements OnInit {
  @Input() values: Array<any> = [];
  valuesInput = new FormControl('');
  valuesModel: any;
  @Output() valuesEvent = new EventEmitter<any>();
  @Output() clearEvent = new EventEmitter<any>();
  @Input() label: string;

  @ViewChild('Instance')
  Instance: NgbTypeahead;
  Focus$ = new Subject<string>();
  Click$ = new Subject<string>();

  constructor() {
  }
  // this function initiates the search logic that displays list of accounts for account to Debit
  universalTypeahead = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.Click$.pipe(filter(() => !this.Instance.isPopupOpen()));
    const inputFocus$ = this.Focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.values
        : this.values.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  formatter = (x: { name: string, code: string }) => x.name;

  ngOnInit() {
    // this.acctModel = this.accts[0];
  }

  onChange() {
    setTimeout(() => {
      console.log('event: ' + JSON.stringify(this.valuesModel));
      this.valuesEvent.emit(this.valuesModel);
    }, 300);
  }

  clearInput() {
    this.valuesInput.setValue('');
    // this.clearEvent.emit('');
    this.valuesModel = null;
  }
}
