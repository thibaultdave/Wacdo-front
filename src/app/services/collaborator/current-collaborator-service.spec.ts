import { TestBed } from '@angular/core/testing';
import { CurrentCollaboratorService } from './current-collaborator-service';

describe('CurrentCollaboratorService', () => {
  let service: CurrentCollaboratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentCollaboratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});