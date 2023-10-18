import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent {
  @Input('open') open = false;
  @Output('close') close = new EventEmitter<string>()

  private fb = inject(FormBuilder)
  private data = inject(DataService)

  loading = false;

  projectForm!: FormGroup<{
    title: FormControl<string>,
    description: FormControl<string>
  }>;

  constructor() {
    this.projectForm = this.fb.group({
      title: this.fb.nonNullable.control('', Validators.required),
      description: this.fb.nonNullable.control(''),
    })
  }

  closeDialog(): void {
    this.close.emit('closed')
  }

  createBoard(): void {
    this.loading = true;
    this.projectForm.disable()

    const { title = '', description } = this.projectForm.value

    this.data.createBoard(title, description).then(res => {
      this.closeDialog()
    })
  }

}
