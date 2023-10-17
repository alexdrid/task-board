import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private auth = inject(AuthService)
  private data = inject(DataService)

  user = this.auth.currentUser$;

  boards: { id: number, title: string }[] = []

  ngOnInit(): void {
    this.getBoards()

    this.data.handleTableChanges().subscribe(update => {
      this.boards.push(update.new)
    })
  }
  getBoards() {
    this.data.getBoards().then(res => {
      const { data, error } = res
      if (data) {
        this.boards = data.flatMap(item => item.boards as { id: number, title: string }[])
      }
    })
  }

  signOut(): void {
    this.auth.signOut()
  }

  createBoard(): void {
    this.data.createBoard().then(res => {
      console.log(res.data)
    })
  }
}
