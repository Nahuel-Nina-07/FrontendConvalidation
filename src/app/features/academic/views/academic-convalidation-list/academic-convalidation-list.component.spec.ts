import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicConvalidationListComponent } from './academic-convalidation-list.component';

describe('AcademicConvalidationListComponent', () => {
  let component: AcademicConvalidationListComponent;
  let fixture: ComponentFixture<AcademicConvalidationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicConvalidationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcademicConvalidationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
