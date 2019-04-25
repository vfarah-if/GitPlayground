import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloWorldComponent } from './hello-world.component';

function paragraphElement(compiled): HTMLParagraphElement {
  return compiled.querySelector('section > p');
}

describe('HelloWorldComponent', () => {
  let component: HelloWorldComponent;
  let fixture: ComponentFixture<HelloWorldComponent>;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelloWorldComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelloWorldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(compiled).toBeTruthy();
  });

  it('should output hello world', () => {
    const element = paragraphElement(compiled);
    expect(element).toBeTruthy();
    expect(element.innerText).toContain('Hello World');
  });

  it('should output hello vincent', () => {
    component.who = 'Vincent';
    fixture.detectChanges();

    const element = paragraphElement(compiled);

    expect(element).toBeTruthy();
    expect(element.innerText).toContain('Hello Vincent');
  });
});
