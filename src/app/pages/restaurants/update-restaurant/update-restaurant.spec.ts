import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateRestaurant } from './update-restaurant';

describe('UpdateRestaurant', () => {
  let component: UpdateRestaurant;
  let fixture: ComponentFixture<UpdateRestaurant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRestaurant],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateRestaurant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});