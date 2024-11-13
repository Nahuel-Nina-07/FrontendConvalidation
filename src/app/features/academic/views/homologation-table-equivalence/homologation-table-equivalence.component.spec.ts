import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationTableEquivalenceComponent } from './homologation-table-equivalence.component';

describe('HomologationTableEquivalenceComponent', () => {
  let component: HomologationTableEquivalenceComponent;
  let fixture: ComponentFixture<HomologationTableEquivalenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomologationTableEquivalenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomologationTableEquivalenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
