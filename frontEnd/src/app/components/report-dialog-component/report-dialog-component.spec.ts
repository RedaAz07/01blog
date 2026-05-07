import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDialogComponent } from './report-dialog-component';

describe('ReportDialogComponent', () => {
  let component: ReportDialogComponent;
  let fixture: ComponentFixture<ReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
