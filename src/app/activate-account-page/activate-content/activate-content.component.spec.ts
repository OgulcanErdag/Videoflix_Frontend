import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateContentComponent } from './activate-content.component';

describe('ActivateContentComponent', () => {
  let component: ActivateContentComponent;
  let fixture: ComponentFixture<ActivateContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
