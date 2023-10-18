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
import { DataService, LISTS_TABLE } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { List, ListCard } from 'src/app/models/data.model';
import { first, from } from 'rxjs';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports: [CdkDropList, ReactiveFormsModule, NgFor, NgIf, ListItemComponent],
})
export class BoardComponent implements OnInit, AfterViewInit {
  @ViewChildren(CdkDropList) boardDropZones!: QueryList<CdkDropList<ListCard[]>>;

  private data = inject(DataService)
  private route = inject(ActivatedRoute)
  private fb = inject(FormBuilder)

  boardId: string | null = '';

  titleFormControl = new FormControl<string | null>('', Validators.required)

  listForm = this.fb.group({
    lists: this.fb.array<FormControl<string>>([])
  });

  isDragging = false;
  tasks: any[] = [];

  lists: List[] = []
  boardInfo: {
    title: string
  } = {
      title: ''
    };
  listCards = new Map<number, ListCard[]>();

  test(): void {
    console.log('test');

  }


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
      this.data.getBoardLists(this.boardId).then(res => {
        this.lists = res.data as List[]



        this.lists.forEach(list => {
          this.listFormArray.push(
            this.fb.nonNullable.control<string>(list.title, Validators.required)
          )
          this.data.getListCards(list.id).then(res => {
            console.log("🚀 ~ file: board.component.ts:74 ~ BoardComponent ~ this.data.getListCards ~ res:", res)

            this.listCards.set(list.id, res.data || [])
            console.log("🚀 ~ file: board.component.ts:76 ~ BoardComponent ~ this.data.getListCards ~ this.listCards:", this.listCards)
          })

        })


      })

      // // Retrieve cards for each list
      // for (let list of this.lists) {
      //   this.listCards[list.id] = await this.dataService.getListCards(list.id)
      // }


      // // For later...
      this.handleRealtimeUpdates()
    }
    // this.fetchBoard()
  }

  ngAfterViewInit() {
    // this.boardDropZones.forEach((dz) => {
    //   console.log("🚀 ~ file: board.component.ts:101 ~ BoardComponent ~ this.boardDropZones.toArray ~ dz:", dz)
    //   // dz.connectedTo = array.filter(item => item !== dz)
    // })

    this.boardDropZones.changes.pipe(first()).subscribe((list: QueryList<CdkDropList<ListCard[]>>) => {
      list.forEach((dz, _i, array) => dz.connectedTo = array.filter(item => item !== dz))
    });

  }

  saveBoardTitle() {
    this.boardInfo.title = this.titleFormControl.value || ''
    this.data.updateBoard(this.boardInfo).then(() => {
      this.titleFormControl.markAsPristine()
    })
  }

  createList(): void {
    this.data.addBoardList(this.boardId!, this.lists.length).then(res => {
      console.log("🚀 ~ file: board.component.ts:98 ~ BoardComponent ~ this.data.addBoardList ~ res:", res)

    })
  }

  saveListTitle(index: number): void {
    console.log("🚀 ~ file: board.component.ts:103 ~ BoardComponent ~ saveCardTitle ~ index:", this.lists[index])

    const listControl = this.listFormArray.at(index)
    const newList: List = {
      ...this.lists[index],
      title: listControl.value
    }
    this.data.updateBoardList(newList).then((res) => {
      listControl.markAsPristine()
    })
  }

  addCard(index: number): void {
    const targetList: List = this.lists[index]
    this.data.addListCard(targetList.id, this.boardId!, this.listCards.get(targetList.id)!.length).then((res) => {
    })
  }

  updateCard(card: ListCard): void {
    this.data.updateCard(card).then(res => {

    })
  }

  drop(event: CdkDragDrop<ListCard[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const droppedCard: ListCard = { ...event.container.data[event.currentIndex], position: event.currentIndex }

      this.data.updateCard(droppedCard).then((res) => {
        console.log("🚀 ~ file: board.component.ts:167 ~ BoardComponent ~ this.data.updateCard ~ res:", res)
      })
      const droppedCard2: ListCard = { ...event.container.data[event.previousIndex], position: event.previousIndex }

      this.data.updateCard(droppedCard2).then((res) => {
        console.log("🚀 ~ file: board.component.ts:167 ~ BoardComponent ~ this.data.updateCard ~ res:", res)
      })

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

  handleRealtimeUpdates() {
    this.data.getTableChanges(LISTS_TABLE).subscribe(payload => {

      switch (payload.eventType) {
        case 'INSERT':
          const newList: List = payload.new as List
          this.lists.push(newList)
          this.listFormArray.push(
            this.fb.nonNullable.control<string>(newList.title, Validators.required)
          )
          break;
        case 'UPDATE':
          const updatedList: List = payload.new as List
          this.listFormArray.at(updatedList.position).setValue(updatedList.title)
          break;
        case 'DELETE':
          const { id }: List = payload.old as List
          const listIndex = this.lists.findIndex(list => list.id === id)
          this.listFormArray.removeAt(listIndex)
          this.lists.splice(listIndex, 1)
          break;

        default:
          break;
      }
    })
  }


  getListData(index: number): ListCard[] {
    const list: List = this.lists[index]
    return this.listCards.get(list.id) || []
  }

  get listFormArray(): FormArray<FormControl<string>> {
    return this.listForm.controls.lists
  }
}
