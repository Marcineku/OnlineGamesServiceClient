import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
