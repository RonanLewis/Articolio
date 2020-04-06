import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Article } from '@/_models';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  constructor(private http: HttpClient,
    private sanitizer: DomSanitizer) { }

  getAll() {
    return this.http.get<Article[]>(`${environment.apiUrl}/articles`);
  }

  add(article: Article) {
    let fdArticle = new FormData();
    for (var key in article) {
      fdArticle.append(key, article[key]);
    }
    return this.http.post(`${environment.apiUrl}/articles/add`, fdArticle);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/articles/${id}`);
  }

  getAllByCurrent() {
    return this.http.get<Article>(`${environment.apiUrl}/articles/current`);
  }

  getByUsername(username: string) {
    return this.http.get<Article[]>(`${environment.apiUrl}/articles/name/${username}`);
  }

  getByID(id: number) {
    return this.http.get<Article>(`${environment.apiUrl}/articles/${id}`);
  }

  postImage(imageData: { file: any }) {
    const formData = new FormData();
    formData.append('image', imageData.file);
    return this.http.post(`${environment.apiUrl}/articles/image/upload`, formData);
  }

  deleteImage(imagePath) {
    return this.http.delete(`${environment.apiUrl}/articles/image/delete/${imagePath}`);
  }
  // converts HTML to text using Javascript
  html2text(html) {
    var tag = document.createElement('div');
    tag.innerHTML = html;

    return tag.innerText;
  }

}

