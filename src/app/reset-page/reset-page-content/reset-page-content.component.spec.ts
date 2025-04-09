import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPageContentComponent } from './reset-page-content.component';

describe('ResetPageContentComponent', () => {
  let component: ResetPageContentComponent;
  let fixture: ComponentFixture<ResetPageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPageContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
