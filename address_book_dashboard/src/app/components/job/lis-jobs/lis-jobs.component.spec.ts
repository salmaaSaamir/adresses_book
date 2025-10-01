import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LisJobsComponent } from './lis-jobs.component';

describe('LisJobsComponent', () => {
  let component: LisJobsComponent;
  let fixture: ComponentFixture<LisJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LisJobsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LisJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
