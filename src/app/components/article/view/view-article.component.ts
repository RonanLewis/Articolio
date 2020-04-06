import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService, AuthenticationService, ArticleService } from '@/_services';
import { first } from 'rxjs/operators';
import { Article } from '@/_models';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.css']
})
export class ViewArticleComponent implements OnInit {
  private sub: any;
  article: Article;
  articleFound: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private articleService: ArticleService,
  ) { }

  ngOnInit(): void {
    this.sub = this.route.queryParams.subscribe(params => {
      let articleID = params['id'];
      // In a real app: dispatch action to load the details here.
      if (articleID) {
        this.articleService.getByID(articleID).pipe(first()).subscribe(article => {
          this.articleFound = true;
          this.article = article;
        })
      } else {

      }

    });
  }
}
