import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicLayoutComponent } from './academic-layout.component';

describe('AcademicLayoutComponent', () => {
  let component: AcademicLayoutComponent;
  let fixture: ComponentFixture<AcademicLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcademicLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
