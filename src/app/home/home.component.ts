import { Component, OnInit } from '@angular/core';
import { AppService, Hello } from '../app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private hello: Hello = { message: '' };

  constructor(private app: AppService) { }

  ngOnInit() {
    this.app.getHello().subscribe(data => this.hello = data);
  }
}
