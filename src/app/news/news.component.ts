import { Component, OnInit } from '@angular/core';
import { News, NewsService } from '../services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  newsList: News[] = [];

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.newsService.getNews().subscribe(
      data => {
        this.newsList = data;
      },
      error => {
        console.log(error);
      }
    );
  }
}
