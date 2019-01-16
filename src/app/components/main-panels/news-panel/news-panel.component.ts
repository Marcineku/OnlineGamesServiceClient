import { Component, OnInit } from '@angular/core';
import {News, NewsService} from '../../../services/news.service';

@Component({
  selector: 'app-news-panel',
  templateUrl: './news-panel.component.html',
  styleUrls: ['./news-panel.component.css']
})
export class NewsPanelComponent implements OnInit {
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
