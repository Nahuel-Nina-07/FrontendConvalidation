import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicRelationSubjectsComponent } from './academic-relation-subjects.component';

describe('AcademicRelationSubjectsComponent', () => {
  let component: AcademicRelationSubjectsComponent;
  let fixture: ComponentFixture<AcademicRelationSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicRelationSubjectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcademicRelationSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
