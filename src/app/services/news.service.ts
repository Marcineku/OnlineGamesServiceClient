import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {NewsDTO} from '../request-bodies/news-d-t-o';

export interface News {
  id: number;
  type: string;
  title: string;
  text: string;
  publicationDate: string;
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  public getNews(): Observable<News[]> {
    return this.http.get<News[]>('news');
  }

  public createNews(newsDTO: NewsDTO): Observable<string> {
    return this.http.post('news', newsDTO, { responseType: 'text' } );
  }
}
