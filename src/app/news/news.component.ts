import { Component, OnInit } from '@angular/core';
import {AppService, News} from '../app.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  private news: News[] = [];

  constructor(private app: AppService) { }

  ngOnInit() {
    this.app.getNews().subscribe(data => this.news = data);
  }
}
