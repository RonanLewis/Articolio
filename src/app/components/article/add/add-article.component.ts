import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Article, User } from "@/_models";
import { requiredFileType, getBase64 } from "@/_helpers";
import { ToastrService } from 'ngx-toastr';
import { ArticleService, AuthenticationService } from '@/_services';
import { first, debounceTime, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '@environments/environment';
import { Subject } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})

export class AddArticleComponent implements OnInit {
  loading = false;
  isArticleSaved = false;
  submitFormSubject = new Subject<any>();
  currentUser: User;
  newArticleForm: FormGroup;
  newArticle: Article;
  imageHelper = {
    quillArticleImageUrls: [],
    quillArticleImageUrlsToDelete: [],
    articleService: this.articleService,
    deleteUnusedImagesSubject: new Subject<any>(),
    previewImageURL: null,
    deleteAllImages: function () {
      this.deleteUnusedImages();
      if (this.quillArticleImageUrls.length > 0) {
        this.articleService.deleteImage(JSON.stringify(this.quillArticleImageUrls)).pipe(first()).subscribe(res => {
          this.quillArticleImageUrls = [];
        });
      }
    },
    deleteUnusedImages: function () {
      console.log(this.quillArticleImageUrlsToDelete);
      if (this.quillArticleImageUrlsToDelete.length > 0) {
        console.log(this.quillArticleImageUrlsToDelete);
        this.articleService.deleteImage(JSON.stringify(this.quillArticleImageUrlsToDelete)).pipe(first()).subscribe(res => {
          this.quillArticleImageUrlsToDelete = [];
        });
      }
    }
  }
  public image;
  @ViewChild('quillFile') quillFileRef: ElementRef;
  quillFile: any;
  meQuillRef: any;
  editorModules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: 1 }, { header: 2 }],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'image']
      ],
      handlers: {
        image: (image) => {
          this.customImageUpload(image);
        }
      }
    },
  };
  // Constructor
  constructor(
    private toastr: ToastrService,
    private location: Location,
    private router: Router,
    private authenticationService: AuthenticationService,
    private articleService: ArticleService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.imageHelper.deleteUnusedImagesSubject.pipe(debounceTime(1000)).subscribe(value => {
      this.imageHelper.deleteUnusedImages();
    })
    // Form submit.
    this.submitFormSubject.pipe(debounceTime(500)).subscribe(form => {
      if (this.isArticleValid()) {
        this.newArticle.createdBy = this.currentUser.username;
        this.newArticle.title = form.articleTitle;
        this.newArticle.contentText = this.articleService.html2text(form.articleContent);
        this.newArticle.contentHTML = form.articleContent;
        this.newArticle.tags = form.articleTags;
        // Post article to database.
        this.articleService.add(this.newArticle).pipe(first())
          .subscribe(
            data => {
              this.loading = false;
              this.isArticleSaved = true;
              this.toastr.success('Article added successfully.');
              this.router.navigate(['/user']);
            },
            error => {
              this.loading = false;
              this.toastr.error(error);
            });
      } else {
        this.loading = false;
        this.toastr.error("Invalid article.");
      }
    })
  }
  ngOnInit() {
    this.newArticle = new Article();
    this.newArticleForm = new FormGroup({
      'articleTitle': new FormControl(this.newArticle.title, [Validators.required, Validators.minLength(4)/*, forbiddenNameValidator(/^[a-zA-Z0-9\s]+$/)*/]),
      'articleContent': new FormControl(this.newArticle.contentText, [Validators.required]),
      'articleTags': new FormControl(this.newArticle.tags),
      'articleImage': new FormControl(null, [Validators.required])
    });

  }

  get articleTitle() { return this.newArticleForm.get('articleTitle'); }
  get articleContent() { return this.newArticleForm.get('articleContent'); }
  get articleTags() { return this.newArticleForm.get('articleTags'); }
  get articleImage() { return this.newArticleForm.get('articleImage'); }

  isArticleValid() {
    return (!this.articleTitle.invalid && !this.articleContent.invalid && !this.articleTags.invalid);
  }

  onSubmit(form) {
    this.loading = true;
    this.submitFormSubject.next(form);
  }
  cancel() {
    this.location.back();
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var mimeType = file.type;
      if (mimeType.match(/image\/*/) == null) {
        this.articleImage.setValue(null);
        this.toastr.error("Only images are supported.");
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.imageHelper.previewImageURL = reader.result;
      }

      this.newArticle.image = file;

    }
  }

  getMeEditorInstance(editorInstance: any) {
    this.meQuillRef = editorInstance;
  }

  customImageUpload(image: any) {
    /* Here we trigger a click action on the file input field, this will open a file chooser on a client computer */
    this.quillFileRef.nativeElement.click();
  }

  quillFileSelected(ev: any) {
    /* After the file is selected from the file chooser, we handle the upload process */
    this.quillFile = ev.target.files[0];
    const imageData = {
      file: this.quillFile
    };
    this.articleService.postImage(imageData).pipe(first()).subscribe(
      (response: any) => {
        const imgPath = response.path;
        const filename = imgPath.split('\\')[imgPath.split('\\').length - 1]
        let range: any;
        this.imageHelper.quillArticleImageUrls.push(filename);
        const img = '<img class="img-within" src="' + environment.serverUrl + imgPath + '"></img>';
        range = this.meQuillRef.getSelection();
        this.quillFileRef.nativeElement.value = null;
        this.meQuillRef.clipboard.dangerouslyPasteHTML(range.index, img);
      }
    );
  }

  resetImagePicker() {
    this.imageHelper.previewImageURL = '';
    this.articleImage.setValue('');
  }

  checkImagesToDelete(editor) {
    for (var i = 0; i < this.imageHelper.quillArticleImageUrls.length; i++) {
      const filename = this.imageHelper.quillArticleImageUrls[i];
      if (editor.html) {
        if (!editor.html.includes(filename)) {
          this.imageHelper.quillArticleImageUrlsToDelete.push(filename);
          this.imageHelper.quillArticleImageUrls.splice(i, 1);
          i--; //decrement i IF we remove an item}}
        }
      }
      else {
        this.imageHelper.quillArticleImageUrlsToDelete.push(filename);
        this.imageHelper.quillArticleImageUrls.splice(i, 1);
        i--; //decrement i IF we remove an item}}
      }
    }
    this.imageHelper.deleteUnusedImagesSubject.next(event);
  }
}
