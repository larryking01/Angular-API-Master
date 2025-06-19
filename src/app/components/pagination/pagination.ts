import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss'
})
export class Pagination {

  @Input() totalItems = 0;
  @Input() itemsPerPage = 10;
  @Input() currentPage = 1;

  @Output() pageChanged = new EventEmitter<number>()


  // dynamically compute total pages.
  totalPages = computed(() => Math.ceil(this.totalItems / this.itemsPerPage))

  // emit new page when clicked
  changePage( page: number ) {
    if( page >= 1 && page <= this.totalPages()) {
      this.pageChanged.emit(page)
    } 
  }


}
