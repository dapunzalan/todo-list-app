import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityBadgeComponent } from './priority-badge.component';

describe('PriorityBadgeComponent', () => {
  let component: PriorityBadgeComponent;
  let fixture: ComponentFixture<PriorityBadgeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PriorityBadgeComponent]
    });
    fixture = TestBed.createComponent(PriorityBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
