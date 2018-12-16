import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-gt-sweep',
  templateUrl: './gt-sweep.component.html',
  styleUrls: ['./gt-sweep.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('800ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('500ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ],
})
export class GtSweepComponent implements OnInit {
  gtSweepForm: FormGroup;
  isLoading: boolean;
  errorMessage: string;
  selectedCurrency: any;
  currencies: any;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createGtSweepForm();
  }

  createGtSweepForm() {
    this.gtSweepForm = this.fb.group({
      'secretAnswer': ['', Validators.required]
    });
  }

  onSubmit() {
    console.log('submitted');
  }

  optionSelected(option) {
    console.log('selected');
  }

}
