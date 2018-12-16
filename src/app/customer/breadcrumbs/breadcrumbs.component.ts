import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { filter } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnDestroy {
  tempState = [];
  breadcrumbs: Array<any>;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd)
    ).pipe(untilComponentDestroyed(this)).subscribe(() => {
        this.breadcrumbs = [];
        this.tempState = [];
        let currentRoute = this.route.root,
            url = '';
        do {
          const childrenRoutes = currentRoute.children;
          currentRoute = null;
          childrenRoutes.forEach(routes => {
            if (routes.outlet === 'primary') {
              const routeSnapshot = routes.snapshot;
              url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
              if (routes.snapshot.data.title !== undefined) {
                let status = true;
                if (routes.snapshot.data.status !== undefined) {
                  status = routes.snapshot.data.status;
                }

                let icon = false;
                if (routes.snapshot.data.icon !== undefined) {
                  icon = routes.snapshot.data.icon;
                }

                let caption = false;
                if (routes.snapshot.data.caption !== undefined) {
                  caption = routes.snapshot.data.caption;
                }

                if (!this.tempState.includes(routes.snapshot.data.title)) {
                  this.tempState.push(routes.snapshot.data.title);
                  this.breadcrumbs.push({
                    label: routes.snapshot.data.title,
                    icon: icon,
                    caption: caption,
                    status: status,
                    url: url
                  });
                }
              }
              currentRoute = routes;
            }
          });
        } while (currentRoute);
      });
  }

  ngOnDestroy(): void {
  }
}
