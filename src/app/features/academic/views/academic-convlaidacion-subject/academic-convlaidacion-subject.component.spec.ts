import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicConvlaidacionSubjectComponent } from './academic-convlaidacion-subject.component';

describe('AcademicConvlaidacionSubjectComponent', () => {
  let component: AcademicConvlaidacionSubjectComponent;
  let fixture: ComponentFixture<AcademicConvlaidacionSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicConvlaidacionSubjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcademicConvlaidacionSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
