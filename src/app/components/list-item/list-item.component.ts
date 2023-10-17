import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  hostDirectives: [
    {
      directive: CdkDrag,
      outputs: ['cdkDragStarted: dragStart', 'cdkDragEnded: dragEnd'],
    },
  ],
})
export class ListItemComponent {
  @Input() text!: string;

  dragStart() {
    console.log('start drag');
  }
}
