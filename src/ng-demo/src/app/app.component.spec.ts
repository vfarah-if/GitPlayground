import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { HelloWorldUsersService } from './api/hello-world-users';

function headerElement(compiled): HTMLHeadElement {
  return compiled.querySelector('h1');
}

function helloWorldElements(compiled): HTMLElement[] {
  return compiled.querySelectorAll('app-hello-world');
}

function anchorElements(compiled): Array<HTMLAnchorElement> {
  return compiled.querySelectorAll('h2 > a');
}

describe('AppComponent', () => {
  let fixture;
  let app;
  let compiled;
  let apiService: HelloWorldUsersService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HelloWorldModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    // Spy on the service but instead return one record
    apiService = TestBed.get(HelloWorldUsersService);
    spyOn(apiService, 'getAllUsers').and.returnValue(new Array<string>('Samuel'));
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ng-demo'`, () => {
    expect(app.title).toEqual('ng-demo');
  });

  it('should render title in a h1 tag', () => {
    const element = headerElement(compiled);
    expect(element.textContent).toContain('Welcome to ng-demo!');
  });

  it('should contain three anchors', () => {
    const elements = anchorElements(compiled);
    expect(elements.length).toBe(3);
    expect(elements[0].innerText).toBe('Tour of Heroes');
    expect(elements[1].innerText).toBe('CLI Documentation');
    expect(elements[2].innerText).toBe('Angular blog');
  });

  it('should render several hello world components', () => {
    const elements = helloWorldElements(compiled);
    expect(elements).toBeTruthy();
    expect(elements.length).toBe(3);
    expect(apiService.getAllUsers).toHaveBeenCalled();
  });
});
