import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectPropertiesComponent } from './rect-properties.component';

describe('RectPropertiesComponent', () => {
  let component: RectPropertiesComponent;
  let fixture: ComponentFixture<RectPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
