import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService, AuthenticationService, ArticleService } from '@/_services';
import { User, Article } from '@/_models';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from '@environments/environment';
@Component({
  selector: 'app-user-channel',
  templateUrl: './user-channel.component.html',
  styleUrls: ['./user-channel.component.css']
})
export class UserChannelComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private articleService: ArticleService,
    private sanitizer: DomSanitizer
  ) { }
  env = environment;
  user = new User();
  userArticles: Article[] = [];
  private sub: any;
  dateNow: Date = new Date(Date.now());

  ngOnInit(): void {

    this.sub = this.route.params.subscribe(params => {
      let username = params['username'];

      // In a real app: dispatch action to load the details here.
      if (username) {
        // Get user who's name is specified in the route params.
        this.userService.getByUsername(username)
          .pipe(first())
          .subscribe(
            user => {
              this.user = user;
              this.loadUserArticles();
            },
            err => {
              this.user.username = "Error: " + err;
            });
      } else {
        // Get current user.
        this.userService.getCurrent().pipe(first()).subscribe(cur => {
          this.user = cur;
          this.loadUserArticles();
        });
      }
    });
  }

  loadUserArticles() {
    this.articleService.getByUsername(this.user.username).pipe(first()).subscribe(articles => {
      this.userArticles = articles;
    });
  }

  dateDifferenceFromNow(lastUpdate: Date) {
    let dateNow = Date.now();
    lastUpdate = new Date(lastUpdate);

    var seconds = Math.floor(((dateNow) - lastUpdate.getTime()) / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

    return {
      days: Math.abs(days),
      hours: Math.abs(hours),
      mins: Math.abs(minutes),
      seconds: Math.abs(seconds)
    }
  }

}
