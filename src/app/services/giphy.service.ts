import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {InterceptorSkipHeader} from '../http-interceptors/api-interceptor';
import {map} from 'rxjs/operators';

const httpHeaders = new HttpHeaders().set(InterceptorSkipHeader, '');

@Injectable({
  providedIn: 'root'
})
export class GiphyService {
  private apiUrl = '//api.giphy.com/v1/gifs/';
  private apiKey = '?api_key=boVwnAZPXFBeadBJH1aTStQxYXpWhbz8';

  constructor(private http: HttpClient) {
  }

  getGif(gif: Gif) {
    return this.http.get(this.apiUrl + gif + this.apiKey, {headers: httpHeaders}).pipe(
      map((res: any) => {
        if (res) {
          return res.data.images.original.url;
        } else {
          return 'https://media.giphy.com/media/9J7tdYltWyXIY/giphy.gif';
        }
      })
    );
  }
}

export enum Gif {
  TicTacToe = 'gFpQKMNreK2nm',
  GitMerge = 'cFkiFMDg3iFoI'
}
