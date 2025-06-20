import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableNotFound } from './reusable-not-found';

describe('ReusableNotFound', () => {
  let component: ReusableNotFound;
  let fixture: ComponentFixture<ReusableNotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableNotFound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableNotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
