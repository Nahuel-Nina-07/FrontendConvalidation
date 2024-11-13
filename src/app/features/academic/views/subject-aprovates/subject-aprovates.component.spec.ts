import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectAprovatesComponent } from './subject-aprovates.component';

describe('SubjectAprovatesComponent', () => {
  let component: SubjectAprovatesComponent;
  let fixture: ComponentFixture<SubjectAprovatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectAprovatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectAprovatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
