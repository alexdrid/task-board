import { AfterViewInit, Component, ElementRef, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements AfterViewInit {

  @Output() onSave = new EventEmitter<string>()
  @Output() onCancel = new EventEmitter<void>()

  private fb = inject(FormBuilder)
  private elementRef: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>)

  loading = false;

  itemForm = this.fb.group({
    title: this.fb.nonNullable.control<string>('', Validators.required)
  });

  ngAfterViewInit(): void {
    console.log(this.elementRef.nativeElement);
    this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }


  save(): void {
    this.onSave.emit(this.title)
  }

  cancel(): void {
    this.onCancel.emit()
  }

  get title(): string {
    return this.itemForm.value.title || ''
  }
}
