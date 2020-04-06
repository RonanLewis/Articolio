import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  currentUser: User;
  users = [];
  test: User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.test = new User();
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  getCurrent() {
    this.userService.getCurrent().pipe(first()).subscribe(cur => this.currentUser = cur);
  }

  logOut() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  private loadAllUsers() {
    this.userService.getAll()
      .pipe(first())
      .subscribe(users => this.users = users);
  }
}
