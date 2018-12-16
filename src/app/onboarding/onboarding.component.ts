import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');
    // document.querySelector('body').style.height = '100%';
    // document.querySelector('html').style.height = '100%';

  }

}
