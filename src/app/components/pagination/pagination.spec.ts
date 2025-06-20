import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination } from './pagination';
import { CommonModule } from '@angular/common';



fdescribe('Pagination Component', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [Pagination],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the Pagination component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total pages correctly', () => {
    component.totalItems = 45;
    component.itemsPerPage = 10;
    expect(component.totalPages()).toBe(5);
  });

  it('should emit pageChanged event when valid page is clicked', () => {
    spyOn(component.pageChanged, 'emit');
    component.totalItems = 50;
    component.itemsPerPage = 10;

    component.changePage(3);

    expect(component.pageChanged.emit).toHaveBeenCalledWith(3);
  });

});
