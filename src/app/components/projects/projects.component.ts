import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { Board } from 'src/app/models/data.model';
import { AuthService } from 'src/app/services/auth.service';
import { BOARDS_TABLE, DataService } from 'src/app/services/data.service';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  imports: [CommonModule, RouterLink, RouterOutlet, ProjectDialogComponent]
})
export class ProjectsComponent {
  private auth = inject(AuthService)
  private data = inject(DataService)
  private router = inject(Router)

  user = this.auth.currentUser$;

  boards: { id: number, title: string }[] = []

  showDialog = false;

  ngOnInit(): void {
    this.getBoards()

    this.handleChanges();

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
    this.showDialog = true;
  }

  closeDialog(result: string): void {
    this.showDialog = false;
  }

  getRouterLink(id: number): string {
    return id.toString()
  }

  private handleChanges() {
    // Handle new boards inserts
    this.data.getTableChanges(BOARDS_TABLE).subscribe((payload: RealtimePostgresChangesPayload<Board>) => {
      console.log("🚀 ~ file: projects.component.ts:61 ~ ProjectsComponent ~ this.data.getTableChanges ~ payload:", payload)

      switch (payload.eventType) {
        case 'INSERT':
          const newBoard: Board = payload.new as Board
          this.boards.push(newBoard)
          this.router.navigateByUrl(`/projects/${newBoard.id}`)
          break;
        case 'UPDATE':
          // const updatedListCard: ListCard = payload.new as ListCard
          // this.listFormArray.at(updatedListCard.position).setValue(updatedListCard.title)
          break;
        case 'DELETE':
          const { id }: Board = payload.old as Board;
          this.boards.filter(board => board.id !== id)
          break;

        default:
          break;
      }
    })


  }
}
