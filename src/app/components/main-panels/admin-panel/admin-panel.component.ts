import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {NewsService} from '../../../services/news.service';
import {NewsDTO} from '../../../request-bodies/news-d-t-o';
import {GithubService, Traffic} from '../../../services/github.service';
import {Gif, GiphyService} from '../../../services/giphy.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  type = new FormControl('', [Validators.required]);
  title = new FormControl('', [Validators.required]);
  text = new FormControl('', [Validators.required]);
  languages = new FormControl('', [Validators.required]);
  languagesList: string[] = ['en', 'pl'];

  info = '';

  clientTraffic: Traffic;
  serverTraffic: Traffic;

  constructor(private newsService: NewsService,
              private github: GithubService,
              private giphy: GiphyService) {
  }

  ngOnInit() {
    this.github.getClientTraffic().subscribe(
      res => {
        this.clientTraffic = res;
      }
    );

    this.github.getServerTraffic().subscribe(
      res => {
        this.serverTraffic = res;
      }
    );
  }

  onCreateNews() {
    if (this.type.value.length === 0 || this.title.value.length === 0 || this.text.value.length === 0
      || this.languages.value.length === 0 || this.type.invalid || this.title.invalid || this.text.invalid || this.languages.invalid) {
      return;
    }

    this.newsService.createNews(new NewsDTO(this.type.value, this.title.value, this.text.value, this.languages.value)).subscribe(
      data => {
        this.type.reset();
        this.title.reset();
        this.text.reset();
        this.languages.reset();

        this.info = 'News was successfully created';
      },
      error => {
        console.log(error);

        this.info = 'Error';
      }
    );
  }
}
