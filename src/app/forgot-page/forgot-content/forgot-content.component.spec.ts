import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotContentComponent } from './forgot-content.component';

describe('ForgotContentComponent', () => {
  let component: ForgotContentComponent;
  let fixture: ComponentFixture<ForgotContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
