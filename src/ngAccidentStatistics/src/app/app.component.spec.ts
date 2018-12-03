
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

import {
  AccidentStatisticTestingModule,
  AccidentStatisticMapMockComponent,
  AccidentStatisticQueryMockComponent,
  AccidentStatisticListMockComponent} from './accident-statistic/testing';

function accidentMapElements(compiled): Array<AccidentStatisticMapMockComponent> {
  return compiled.querySelectorAll('app-accident-statistic-map');
}

function accidentQueryElements(compiled): Array<AccidentStatisticQueryMockComponent> {
  return compiled.querySelectorAll('app-accident-statistic-query');
}

function accidentListElements(compiled): Array<AccidentStatisticListMockComponent> {
  return compiled.querySelectorAll('app-accident-statistic-list');
}

function headerElement(compiled): HTMLHeadElement {
  return compiled.querySelector('h1');
}

function header2Element(compiled): HTMLHeadingElement {
  return compiled.querySelector('h2');
}

fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AccidentStatisticTestingModule,
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'ngAccidentStatistics'`, () => {
    expect(component.title).toEqual('ngAccidentStatistics');
  });

  it('should render title in a h1 tag', () => {
    expect(headerElement(compiled).textContent).toContain('Welcome to ngAccidentStatistics!');
  });

  it('should render title in a h2 tag', () => {
    expect(header2Element(compiled).textContent).toContain('Business case for Accident Statistics');
  });

  it('should render 3 types of map components', () => {
    expect(accidentMapElements(compiled).length).toBe(3);
  });

  it('should render 1 types of query components', () => {
    expect(accidentQueryElements(compiled).length).toBe(1);
  });

  it('should render 5 types of list components', () => {
    expect(accidentListElements(compiled).length).toBe(5);
  });
});
