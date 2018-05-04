import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CirclePropertiesComponent } from './circle-properties.component';

describe('CirclePropertiesComponent', () => {
  let component: CirclePropertiesComponent;
  let fixture: ComponentFixture<CirclePropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CirclePropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CirclePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
