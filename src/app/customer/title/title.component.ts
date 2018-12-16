import { Component, OnDestroy } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {isUndefined} from 'util';
import { filter } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-title',
  template: '<span></span>'
})
export class TitleComponent implements OnDestroy {
  constructor(private router: Router, private route: ActivatedRoute, private titleService: Title) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).pipe(untilComponentDestroyed(this)).subscribe(() => {
        let currentRoute = this.route.root;
        let title = '';
        do {
          const childrenRoutes = currentRoute.children;
          currentRoute = null;
          childrenRoutes.forEach(routes => {
            if (routes.outlet === 'primary') {
              title = routes.snapshot.data.title;
              currentRoute = routes;
            }
          });
        } while (currentRoute);
        if (title !== undefined ) {
          this.titleService.setTitle(title + ' | GTB-iBank');
        }
      });
  }

  ngOnDestroy(): void {

  }
}
