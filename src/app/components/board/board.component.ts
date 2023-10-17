import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDragStart,
} from '@angular/cdk/drag-drop';
import { ListItemComponent } from '../list-item/list-item.component';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports: [CdkDropList, NgFor, NgIf, ListItemComponent],
})
export class BoardComponent implements OnInit{
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  isDragging = false;
  tasks: any[] = [];

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit(): void {
    // this.fetchTasks()
  }

  async fetchTasks(): Promise<void> {
    let { data: tasks, error } = await this.supabase.fetchTasks()
    if (error) {
      console.error('error', error.message)
    } else {
      this.tasks = tasks ?? []
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onDragStart() {
    this.isDragging = true;
  }

  onDragEnd() {
    this.isDragging = false;
  }
}
