import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCollaborator } from './update-collaborator';

describe('UpdateCollaborator', () => {
  let component: UpdateCollaborator;
  let fixture: ComponentFixture<UpdateCollaborator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCollaborator],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCollaborator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});