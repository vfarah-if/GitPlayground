import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HelloWorldModule } from './hello-world/hello-world.module';

function headerElement(compiled): HTMLHeadElement {
  return compiled.querySelector('h1');
}

describe('AppComponent', () => {
  let fixture;
  let app;
  let compiled;

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
});
