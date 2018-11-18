import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { MessageService } from './message.service';
import { catchError, tap } from 'rxjs/operators';

export interface Hello {
  message: string;
}

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
export class AppService {
  private helloUrl = 'hello';
  private newsUrl = 'news';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  public getHello(): Observable<any> {
    return this.http.get(this.helloUrl)
      .pipe(
        tap(_ => this.log('fetched hello')),
        catchError(this.handleError('getHello', []))
      );
  }

  public getNews(): Observable<any> {
    return this.http.get(this.newsUrl)
      .pipe(
        tap(_ => this.log('fetched news')),
        catchError(this.handleError('getNews', []))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`AppService: ${message}`);
  }
}
