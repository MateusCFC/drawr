import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrianglePropertiesComponent } from './triangle-properties.component';

describe('TrianglePropertiesComponent', () => {
  let component: TrianglePropertiesComponent;
  let fixture: ComponentFixture<TrianglePropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrianglePropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrianglePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
