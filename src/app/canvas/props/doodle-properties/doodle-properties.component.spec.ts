import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoodlePropertiesComponent } from './doodle-properties.component';

describe('DoodlePropertiesComponent', () => {
  let component: DoodlePropertiesComponent;
  let fixture: ComponentFixture<DoodlePropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoodlePropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoodlePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
