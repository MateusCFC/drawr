import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinePropertiesComponent } from './line-properties.component';

describe('LinePropertiesComponent', () => {
  let component: LinePropertiesComponent;
  let fixture: ComponentFixture<LinePropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinePropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
