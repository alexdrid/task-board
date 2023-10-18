import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
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
      inputs: ['cdkDragDisabled: dragDisabled'],
      outputs: ['cdkDragStarted: dragStart', 'cdkDragEnded: dragEnd'],
    },
  ],
})
export class ListItemComponent {
  @Input() cardInfo!: ListCard;
  @Output() onSave = new EventEmitter<ListCard>()

  titleFormControl = new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })

  dragStart() {
    console.log('start drag');
  }

  updateCard(): void {
    if (this.titleFormControl.value.length > 0) {
      const newCard: ListCard = {
        ...this.cardInfo,
        title: this.titleFormControl.value
      }
      this.onSave.emit(newCard)
    }
  }
}
