import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export class Article {
  id: number;
  title: string;
  contentText: string;
  contentHTML: string;
  tags: string[];
  createdDate: Date;
  createdBy: string;
  lastUpdated: Date[];
  upVotes: number;
  downVotes: number;
  image: {
    contentType: string,
    data: {
      type: string,
      data: number[]
    },
    srcString: SafeUrl
  };

}
