import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloWorldComponent } from './hello-world.component';
import { ShoutPipe } from './shout.pipe';

function paragraphElement(compiled): HTMLParagraphElement {
  return compiled.querySelector('section > p');
}

describe('HelloWorldComponent', () => {
  let component: HelloWorldComponent;
  let fixture: ComponentFixture<HelloWorldComponent>;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelloWorldComponent, ShoutPipe]
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

  it('should output hello WORLD!', () => {
    const element = paragraphElement(compiled);
    expect(element).toBeTruthy();
    expect(element.innerText).toContain('Hello WORLD!');
  });

  it('should output hello VINCENT!', () => {
    component.who = 'Vincent';
    fixture.detectChanges();

    const element = paragraphElement(compiled);

    expect(element).toBeTruthy();
    expect(element.innerText).toContain('Hello VINCENT!');
  });
});
