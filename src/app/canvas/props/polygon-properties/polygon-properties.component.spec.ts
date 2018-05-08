import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonPropertiesComponent } from './polygon-properties.component';

describe('PolygonPropertiesComponent', () => {
  let component: PolygonPropertiesComponent;
  let fixture: ComponentFixture<PolygonPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolygonPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
