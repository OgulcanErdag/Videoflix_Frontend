import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateAccountPageComponent } from './activate-account-page.component';

describe('ActivateAccountPageComponent', () => {
  let component: ActivateAccountPageComponent;
  let fixture: ComponentFixture<ActivateAccountPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateAccountPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateAccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
