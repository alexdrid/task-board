import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragPlaceholder, DragDropModule } from '@angular/cdk/drag-drop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListCard } from 'src/app/models/data.model';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule, DragDropModule, ReactiveFormsModule],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  hostDirectives: [
    {
      directive: CdkDrag,
      inputs: ['cdkDragDisabled: dragDisabled', 'cdkDragData:data'],
      outputs: ['cdkDragStarted: dragStart', 'cdkDragEnded: dragEnd'],
    },

  ],
})
export class ListItemComponent implements OnInit {
  @Input() cardInfo!: ListCard;
  @Output() onRemove = new EventEmitter<ListCard>()
  @Output() onSave = new EventEmitter<ListCard>()

  titleFormControl = new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })

  ngOnInit(): void {
    this.titleFormControl.setValue(this.cardInfo.title)
  }


  remove(): void {
    this.onRemove.emit(this.cardInfo)
  }

  updateCard(): void {
    if (this.titleFormControl.value.length > 0) {
      const newCard: ListCard = {
        ...this.cardInfo,
        title: this.titleFormControl.value
      }
      this.titleFormControl.markAsPristine()
      this.onSave.emit(newCard)
    }
  }
}
