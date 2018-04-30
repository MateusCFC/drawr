import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarPropertiesComponent } from './star-properties.component';

describe('StarPropertiesComponent', () => {
  let component: StarPropertiesComponent;
  let fixture: ComponentFixture<StarPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
