import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({ templateUrl: 'admin.component.html' })

export class AdminComponent implements OnInit {
  currentUser: User;
  users = [];
  toDelete = new User();
  modalRef: BsModalRef;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private modalService: BsModalService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  deleteUser(id: number) {
    this.userService.delete(id)
      .pipe(first())
      .subscribe(() => this.loadAllUsers());
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

  openModal(template: TemplateRef<any>, user: User) {
    this.toDelete = user;
    this.modalRef = this.modalService.show(template, { animated: true });
  }

  confirm(): void {
    if (this.toDelete != null) {
      const id = this.toDelete.id;
      this.deleteUser(this.toDelete.id);
    }
    this.toDelete = null;
    this.modalRef.hide();
  }

  decline(): void {
    this.toDelete = null;
    this.modalRef.hide();
  }
}
