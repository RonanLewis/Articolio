import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';
import { UserService, AuthenticationService, ArticleService } from '@/_services';
import { User } from '@/_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { Location } from '@angular/common';
import { first, debounceTime, map } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  currentUser: User;
  navSearchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private articleService: ArticleService,
    private location: Location,
    private authenticationService: AuthenticationService,
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && localStorage.currentUser) {
        // Delete unused images.
        this.userService.getCurrent().pipe(first()).subscribe(user => {
          this.authenticationService.updateCurrentUser(user);
          this.currentUser = this.authenticationService.currentUserValue;
          var unusedImages = user.unusedImages;
          if (user.unusedImages.length > 0) {
            this.articleService.deleteImage(JSON.stringify(user.unusedImages)).pipe(first()).subscribe(res => {
              user.unusedImages = new Array<string>();
              console.log(user.unusedImages);
              this.authenticationService.updateCurrentUser(user);
              this.currentUser = this.authenticationService.currentUserValue;
            });
          }
        })
      }
    });
  }
  ngOnInit() {
    this.navSearchForm = this.formBuilder.group({
      navSearchTerms: ['', Validators.required],
    });
  }
  back() {
    this.location.back();
  }
  logout() {
    this.authenticationService.logout();
  }
  onSubmit(navSearch) {
    this.router.navigate(['/user', navSearch.navSearchTerms])
  }
}
