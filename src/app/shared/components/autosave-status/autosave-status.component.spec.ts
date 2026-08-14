import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutosaveStatusComponent } from './autosave-status.component';

describe('AutosaveStatusComponent', () => {
  let component: AutosaveStatusComponent;
  let fixture: ComponentFixture<AutosaveStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutosaveStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutosaveStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
