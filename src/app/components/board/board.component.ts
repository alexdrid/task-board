import { AfterViewInit, Component, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
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
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports: [CdkDropList, ReactiveFormsModule, NgFor, NgIf, ListItemComponent],
})
export class BoardComponent implements OnInit, AfterViewInit {
  @ViewChildren(CdkDropList) boardDropZones!: QueryList<CdkDropList<string[]>>;

  boardId: string | null = '';
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  titleFormControl = new FormControl<string | null>('')

  isDragging = false;
  tasks: any[] = [];

  boards: any[] = [
    {
      title: 'Todo',
      lists: this.todo
    },
    {
      title: 'In Progress',
      lists: ['Test']
    },
    {
      title: 'Done',
      lists: this.done
    },

  ]

  private data = inject(DataService)
  private route = inject(ActivatedRoute)
  boardInfo: any;

  ngOnInit(): void {
    this.boardId = this.route.snapshot.paramMap.get('id')
    if (this.boardId) {
      // Load general board information
      this.data.getBoardInfo(this.boardId).then(res => {
        this.boardInfo = res.data
        this.titleFormControl.setValue(this.boardInfo.title)
      })
      // // Retrieve all lists
      // this.lists = await this.dataService.getBoardLists(this.boardId)

      // // Retrieve cards for each list
      // for (let list of this.lists) {
      //   this.listCards[list.id] = await this.dataService.getListCards(list.id)
      // }

      // // For later...
      // this.handleRealtimeUpdates()
    }
    // this.fetchBoard()
  }
  ngAfterViewInit() {
    this.boardDropZones.forEach((dz, _i, array) => {
      dz.connectedTo = array.filter(item => item !== dz)
    })
  }

  // async fetchTasks(): Promise<void> {
  //   let { data: tasks, error } = await this.data.fetchBoard()
  //   if (error) {
  //     console.error('error', error.message)
  //   } else {
  //     this.tasks = tasks ?? []
  //   }
  // }

  saveBoardTitle() {
    this.boardInfo.title = this.titleFormControl.value
    this.data.updateBoard(this.boardInfo).then(() => {
      this.titleFormControl.markAsPristine()
    })
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

  getConnectedLists(cdkDropList: CdkDropList): CdkDropList<string[]>[] {
    return this.boardDropZones?.filter(dz => dz.id !== cdkDropList.id)
  }
}
