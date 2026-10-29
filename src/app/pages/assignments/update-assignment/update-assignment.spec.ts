import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateAssignment } from './update-assignment';

describe('UpdateAssignment', () => {
  let component: UpdateAssignment;
  let fixture: ComponentFixture<UpdateAssignment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAssignment],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateAssignment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});