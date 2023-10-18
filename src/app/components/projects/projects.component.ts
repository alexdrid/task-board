import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  private auth = inject(AuthService)
  private data = inject(DataService)
  private router = inject(Router)

  user = this.auth.currentUser$;

  boards: { id: number, title: string }[] = []

  ngOnInit(): void {
    this.getBoards()

    this.data.handleTableChanges().subscribe(update => {
      console.log("🚀 ~ file: projects.component.ts:25 ~ ProjectsComponent ~ this.data.handleTableChanges ~ update:", update)
      this.boards.push(update.new)

      if (this.boards.length > 0) {
        const newBoard = this.boards.pop()

        if (newBoard) {
          this.router.navigateByUrl(`/projects/${newBoard.id}`)
        }
      }
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



  openDialog(): void {

  }

  createBoard(): void {
    this.data.createBoard().then(res => {
      console.log(res.data)
    })
  }

  getRouterLink(id: number): string {
    return id.toString()
  }
}
