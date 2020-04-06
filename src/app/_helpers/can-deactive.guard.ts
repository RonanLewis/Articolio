import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { AddArticleComponent } from '@/components/article/add';
import { first, map } from 'rxjs/operators';
import { ArticleService } from '@/_services';
import { Article } from '@/_models';
@Injectable()
export class ConfirmDeactivateGuard implements CanDeactivate<AddArticleComponent> {
  constructor(
    private articleService: ArticleService
  ) { }
  canDeactivate(target: AddArticleComponent) {
    return true;
    // if (target.quillArticleImageUrlsToDelete.length > 0) {
    //   return this.articleService.deleteImage(JSON.stringify(target.quillArticleImageUrlsToDelete)).pipe(map(data => {
    //     return true;
    //   }));
    // }
    // if (target.quillArticleImageUrls.length > 0) {
    //   return this.articleService.deleteImage(JSON.stringify(target.quillArticleImageUrlsToDelete)).pipe(map(data => {
    //     return true;
    //   }));
    // }
  }
}
