import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuintButtonComponent } from './suint-button.component';

describe('SuintButtonComponent', () => {
  let component: SuintButtonComponent;
  let fixture: ComponentFixture<SuintButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuintButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuintButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
