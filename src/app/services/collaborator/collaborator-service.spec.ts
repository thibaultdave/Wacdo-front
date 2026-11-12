import { TestBed } from '@angular/core/testing';
import { CollaboratorService } from './collaborator-service';
import { environment } from '../../../environments/environment';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Collaborator as CollaboratorModel } from '../../models/collaborator-response';
import { CollaboratorRequest } from '../../models/collaborator-request';

function createCollaborator(
  overrides: Partial<CollaboratorModel> = {}
): CollaboratorModel {
  return {
    id: 1,
    name: 'Dupont',
    firstName: 'Jean',
    email: 'jean.dupont@test.fr',
    firstHireDate: '2024-01-15',
    admin: false,
    assignments: [],
    ...overrides
  };
}

function createCollaboratorRequest(
  overrides: Partial<CollaboratorRequest> = {}
): CollaboratorRequest {
  return {
    firstName: 'Jean',
    name: 'Dupont',
    email: 'jean.dupont@test.fr',
    firstHireDate: '2024-01-15',
    admin: false,
    password: 'password123',
    ...overrides
  }
}

describe('CollaboratorService', () => {
  let service: CollaboratorService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/api/collaborators`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(CollaboratorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // GET COLLABORATORS

  describe('getCollaborators', () => {

    it('should get all collaborators', () => {
      const mockCollaborators: CollaboratorModel[] = [
        createCollaborator(),
        createCollaborator({
          id: 2,
          firstName: 'Marie',
          name: 'Martin',
          email: 'marie.martin@test.fr',
          firstHireDate: '2023-06-10',
          admin: true
        })
      ];

      let result: CollaboratorModel[] | undefined;

      service.getCollaborators().subscribe({
        next: (collaborators) => {
          result = collaborators;
        }
      });

      const req = httpMock.expectOne(apiUrl);

      expect(req.request.method).toBe('GET');

      req.flush(mockCollaborators);

      expect(result).toEqual(mockCollaborators);
    });

    it('should return an empty list when no collaborators exist', () => {
      let result: CollaboratorModel[] | undefined;

      service.getCollaborators().subscribe({
        next: (collaborators) => {
          result = collaborators;
        }
      });

      const req = httpMock.expectOne(apiUrl);

      expect(req.request.method).toBe('GET');

      req.flush([]);

      expect(result).toEqual([]);
    });

    it('should handle an HTTP error', () => {
      let errorStatus: number | undefined;

      service.getCollaborators().subscribe({
        next: () => {
          throw new Error('The request should have failed');
        },
        error: (error) => {
          errorStatus = error.status;
        }
      });

      const req = httpMock.expectOne(apiUrl);

      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error'
      });
 
      expect(errorStatus).toBe(500);
    });
  });

  // GET COLLABORATOR BY ID
  describe('getCollaboratorById', () => {

    it('should get collaborator by id', () => {
      const mockCollaborator = createCollaborator();
      const mockId = mockCollaborator.id.toString();
      let result: CollaboratorModel | undefined;
      
      service.getCollaboratorById(mockId).subscribe({
        next: (collaborator) => {
          result = collaborator;
        }
      });

      expect(mockId).toBe('1');

      const req = httpMock.expectOne(`${apiUrl}/1`);

      expect(req.request.method).toBe('GET');

      req.flush(mockCollaborator);

      expect(result).toEqual(mockCollaborator);
    });

    it('should handle error when no collaborator found with id', () => {
      let errorStatus: number | undefined;

      service.getCollaboratorById('99').subscribe({
        next: () => {
          throw new Error('The request should have failed');
        },
        error: (error) => {
          errorStatus = error.status;
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/99`);

      req.flush('Server error', {
        status: 404,
        statusText: 'Collaborator not found !'
      });

      expect(errorStatus).toBe(404);
    });

    it('should handle a server error', () => {
      let errorStatus: number | undefined;

      service.getCollaboratorById('1').subscribe({
        error: (error) => {
          errorStatus = error.status;
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);

      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error'
      });

      expect(errorStatus).toBe(500);
    });

    it('should send a request with null id', () => {
      service.getCollaboratorById(null).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/null`);

      expect(req.request.method).toBe('GET');
    });
  });

  // GET CURRENT COLLABORATOR

  describe('getCurrentCollaborator', () => {

    it('should get the current collaborator', () => {
      const mockCollaborator = createCollaborator();
      let result: CollaboratorModel | undefined;

      service.getCurrentCollaborator().subscribe({
        next: (collaborator) => {
          result = collaborator;
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);

      expect(req.request.method).toBe('GET');

      req.flush(mockCollaborator);

      expect(result).toEqual(mockCollaborator);
    });

    it('should handle an unauthorized error', () => {
      let errorStatus: number | undefined;

      service.getCurrentCollaborator().subscribe({
        error: (error) => {
          errorStatus = error.status;
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);

      req.flush('Unauthorized', {
        status: 401,
        statusText: 'Unauthorized'
      });

      expect(errorStatus).toBe(401);
    });

    it('should handle a server error', () => {
      let errorStatus: number | undefined;

      service.getCurrentCollaborator().subscribe({
        error: (error) => {
          errorStatus = error.status;
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);

      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error'
      });

      expect(errorStatus).toBe(500);
    });
  });

  // EMAIL EXISTS

  describe('email-exists', () => {

    it('should tell if email exists', () => {
      const mockEmail = createCollaborator().email;
      let result: boolean | undefined;

      service.emailExists(mockEmail).subscribe({
        next: (emailExists) => {
          result = emailExists;
        }
      });

      const req = httpMock.expectOne(
        request => request.url === `${apiUrl}/email-exists`
      );

      expect(req.request.method).toBe('GET');

      expect(req.request.params.get('email')).toBe(mockEmail);

      req.flush(true);

      expect(result).toBe(true);
    });

    it('should tell if email does not exist', () => {
      const mockEmail = createCollaborator().email;
      let result: boolean | undefined;

      service.emailExists(mockEmail).subscribe({
        next: (emailExists) => {
          result = emailExists;
        }
      });

      const req = httpMock.expectOne(
        request => request.url === `${apiUrl}/email-exists`
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('email')).toBe(mockEmail);

      req.flush(false);

      expect(result).toBe(false);
    });

    it('should handle a server error', () => {
      const mockEmail = createCollaborator().email;
      let errorStatus: number | undefined;

      service.emailExists(mockEmail).subscribe({
        error: (error) => {
          errorStatus = error.status;
        }
      });

      const req = httpMock.expectOne(
        request => request.url === `${apiUrl}/email-exists`
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('email')).toBe(mockEmail);

      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error'
      });

      expect(errorStatus).toBe(500);
    });
  });

  // REMOVE COLLABORATOR

  describe('removeCollaborator', () => {

    it('should remove a collaborator', () => {
      const mockId = createCollaborator().id;

      let completed = false;

      service.removeCollaborator(mockId).subscribe({
        complete: () => {
          completed = true;
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${mockId}`);

      expect(req.request.method).toBe('DELETE');

      req.flush(null);

      expect(completed).toBe(true);
    });

    it('should handle a not found error', () => {
      const mockId = 99;
      let errorStatus: number | undefined;

      service.removeCollaborator(mockId).subscribe({
        error: (error) => {
          errorStatus = error.status;
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${mockId}`);

      expect(req.request.method).toBe('DELETE');

      req.flush('Collaborator not found', {
        status: 404,
        statusText: 'Not Found'
      });

      expect(errorStatus).toBe(404);
    });

    it('should handle a server error', () => {
      const mockId = 1;
      let errorStatus: number | undefined;

      service.removeCollaborator(mockId).subscribe({
        error: (error) => {
          errorStatus = error.status;
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${mockId}`);

      expect(req.request.method).toBe('DELETE');

      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error'
      });

      expect(errorStatus).toBe(500);
    });
  });

  // CREATE COLLABORATOR
  describe('createCollaborator', () => {

    it('should create a collaborator', () => {
      const mockRequest = createCollaboratorRequest();

      const mockResponse = createCollaborator();

      let result: CollaboratorModel | undefined;

      service.createCollaborator(mockRequest).subscribe({
        next: (collaborator) => {
          result = collaborator;
        }
      });

      const req = httpMock.expectOne(apiUrl);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);

      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it('should handle a bad request error', () => {
      const mockRequest = createCollaboratorRequest();

      let errorStatus: number | undefined;

      service.createCollaborator(mockRequest).subscribe({
        error: (error) => {
          errorStatus = error.status;
        }
      });

      const req = httpMock.expectOne(apiUrl);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);

      req.flush('Invalid data', {
        status: 400,
        statusText: 'Bad Request'
      });

      expect(errorStatus).toBe(400);
    });

    it('should handle a server error', () => {
      const mockRequest = createCollaboratorRequest();

      let errorStatus: number | undefined;

      service.createCollaborator(mockRequest).subscribe({
        error: (error) => {
          errorStatus = error.status;
        }
      });

      const req = httpMock.expectOne(apiUrl);

      expect(req.request.method).toBe('POST');

      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error'
      });

      expect(errorStatus).toBe(500);
    });
  });

  // UPDATE COLLABORATOR
  describe('updateCollaborator', () => {

    it('should update a collaborator', () => {
      const mockId = createCollaborator().id.toString();

      const mockRequest = createCollaboratorRequest({
        password: ''
      });

      const mockResponse = createCollaborator();

      let result: CollaboratorModel | undefined;

      service.updateCollaborator(mockId, mockRequest).subscribe({
        next: (collaborator) => {
          result = collaborator;
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${mockId}`);

      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockRequest);

      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it('should handle a not found error', () => {
      const mockId = '99';

      const mockRequest = createCollaboratorRequest({
        password: ''
      });

      let errorStatus: number | undefined;

      service.updateCollaborator(mockId, mockRequest).subscribe({
        error: (error) => {
          errorStatus = error.status;
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${mockId}`);

      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockRequest);

      req.flush('Collaborator not found', {
        status: 404,
        statusText: 'Not Found'
      });

      expect(errorStatus).toBe(404);
    });

    it('should handle a server error', () => {
      const mockId = createCollaborator().id.toString();

      const mockRequest = createCollaboratorRequest({
        password: ''
      });

      let errorStatus: number | undefined;

      service.updateCollaborator(mockId, mockRequest).subscribe({
        error: (error) => {
          errorStatus = error.status;
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${mockId}`);

      expect(req.request.method).toBe('PUT');

      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error'
      });

      expect(errorStatus).toBe(500);
    });
  });
});