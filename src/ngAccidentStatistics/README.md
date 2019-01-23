# NgAccidentStatistics

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.4. Most of this project was developed using standard Angular patterns which can be understood further down with references to the CLI and very good Angular documentation.

The only part I wanted to ellaborate on is my testing folder within each folder. When creating a component or a service, I always create a test component and test module that can be utilised by whatever consumes the artifact. This made things very simple for testing and always puts consuming the component in your design choice. I created a simple testing mechanism for RXJS methods exposing Jasmine Spies for mocking the data expectations and instead of doing Jasmine Marble testing, I exposed simple observables from json data files which allowed easy configuration of different tests, see code for more details. This made it very easy to test data for different scenarios. I kept it simple for testing the components and this strategy lends itself to more complicated scenarios. Take a look at the diffent *testing* folders for a better idea of what I am talking about.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

!["Test Results"](screenshots/TestResults.png)

To debug within tests, simply place *console.log* statements or *debugger* where you want to debug and chrome has all sorts of watches to evaluate and step through the problem.

!["Debugging"](screenshots/DebuggingKarmaWithChrome.png)

Viewing the debug output can be seen within the terminal window, as well as the same information from the chrome browser, which means you could essentially run in headless mode to speed up the tests and see teh results within the terminal.

!["Debugging with vs code"](screenshots/VSCodeDebugging.png)

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). Make sure the Owin Api is running in the background so the test can access the data.

!["Test runner"](screenshots/e2eTestRunner.png)

A summary of the results can be seen within the output.

!["Ouput or terminal"](screenshots/e2eTerminal.png)


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Learn RXJS

This is a fairly complex area, but for more information check out the 
[Learn RXJS](https://www.learnrxjs.io/)

[What changed](https://www.academind.com/learn/javascript/rxjs-6-what-changed/)

[Learn about the new pipe operator](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md)

[Creating streams in angular](https://blog.angularindepth.com/the-extensive-guide-to-creating-streams-in-rxjs-aaa02baaff9a)

## Map libraries

Take a look at utilising this with [openlayers map documentation](https://openlayers.org/en/latest/apidoc/) and the API if you wanted to use this map is [here](https://github.com/openlayers/openlayers)

Developed the map component with Leaflet JS, a fantastic open source map library in conjunction with the team of guys who exposed the Angular and Typescript wrappers to help within the Angular eco system [https://leafletjs.com/](https://leafletjs.com/).
