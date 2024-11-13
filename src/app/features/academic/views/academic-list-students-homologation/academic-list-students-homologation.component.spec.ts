import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicListStudentsHomologationComponent } from './academic-list-students-homologation.component';

describe('AcademicListStudentsHomologationComponent', () => {
  let component: AcademicListStudentsHomologationComponent;
  let fixture: ComponentFixture<AcademicListStudentsHomologationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicListStudentsHomologationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcademicListStudentsHomologationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
