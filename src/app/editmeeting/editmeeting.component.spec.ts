import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmeetingComponent } from './editmeeting.component';

describe('EditmeetingComponent', () => {
  let component: EditmeetingComponent;
  let fixture: ComponentFixture<EditmeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditmeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditmeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
