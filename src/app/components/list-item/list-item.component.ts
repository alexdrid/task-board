import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  hostDirectives: [
    CdkDrag
  ]
})
export class ListItemComponent {
  @Input() text!: string;
}
