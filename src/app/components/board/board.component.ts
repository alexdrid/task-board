import { AfterViewInit, Component, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';
import { ListItemComponent } from '../list-item/list-item.component';
import { CARDS_TABLE, DataService, LISTS_TABLE } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { List, ListCard } from 'src/app/models/data.model';
import { first } from 'rxjs';
import { ItemFormComponent } from "../item-form/item-form.component";

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports: [CdkDropList, ReactiveFormsModule, NgClass, NgFor, NgIf, ListItemComponent, ItemFormComponent]
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
  hideForm: boolean = true;
  formIndex: number | null = null;

  ngOnInit(): void {
    this.boardId = this.route.snapshot.paramMap.get('id')
    if (this.boardId) {
      this.data.getBoardInfo(this.boardId).then(res => {
        this.boardInfo = res.data
        this.titleFormControl.setValue(this.boardInfo.title)
      })

      this.data.getBoardLists(this.boardId).then(res => {
        this.lists = res.data as List[]



        this.lists.forEach(list => {
          this.listFormArray.push(
            this.fb.nonNullable.control<string>(list.title, Validators.required)
          )
          this.data.getListCards(list.id).then(res => {
            this.listCards.set(list.id, res.data || [])
          })

        })


      })
      // // For later...
      this.handleRealtimeUpdates()
    }
  }

  ngAfterViewInit() {
    this.boardDropZones.changes.pipe(first()).subscribe((list: QueryList<CdkDropList<ListCard[]>>) => {
      list.forEach((dz, _i, array) => dz.connectedTo = array.filter(item => item !== dz))
      console.log(list);
      
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
    })
  }

  saveListTitle(index: number): void {

    const listControl = this.listFormArray.at(index)
    const newList: List = {
      ...this.lists[index],
      title: listControl.value
    }
    this.data.updateBoardList(newList).then((res) => {
      listControl.markAsPristine()
    })
  }

  addCard(title: string, index: number): void {
    const targetList: List = this.lists[index]
    console.log("🚀 ~ file: board.component.ts:117 ~ BoardComponent ~ addCard ~ targetList:", targetList)
    this.data.addListCard(title, targetList.id, this.boardId!, this.listCards.get(targetList.id)!.length).then((res) => {
      this.hideTaskForm(index)
    })
  }

  updateCard(card: ListCard): void {
    this.data.updateCard(card).then(res => {

    })
  }

  deleteCard(card: ListCard, listIndex: number): void {
    this.data.deleteCard(card).then(res => {

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
      })
      const droppedCard2: ListCard = { ...event.container.data[event.previousIndex], position: event.previousIndex }

      this.data.updateCard(droppedCard2).then((res) => {
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

    this.data.getTableChanges(CARDS_TABLE).subscribe(payload => {

      switch (payload.eventType) {
        case 'INSERT':
          const newListCard: ListCard = payload.new as ListCard
          const list = this.listCards.get(newListCard.list_id) || []
          this.listCards.set(newListCard.list_id, [...list, newListCard])
          break;
        case 'UPDATE':
          // const updatedListCard: ListCard = payload.new as ListCard
          // this.listFormArray.at(updatedListCard.position).setValue(updatedListCard.title)
          break;
        case 'DELETE':
          const { id }: ListCard = payload.old as ListCard;

          this.listCards.forEach((value, key) => {
            const index = value.findIndex(item => item.id === id);
            if (index !== -1) {
              const removedEntry = value.splice(index, 1);
            }
          });
          break;

        default:
          break;
      }
    })
  }

  showTaskForm(index: number): void {
    this.hideForm = false;
    this.formIndex = index
  }

  hideTaskForm(index: number): void {
    this.hideForm = true;
    this.formIndex = null
  }


  getListData(index: number): ListCard[] {
    const list: List = this.lists[index]
    return this.listCards.get(list.id) || []
  }

  get listFormArray(): FormArray<FormControl<string>> {
    return this.listForm.controls.lists
  }
}
