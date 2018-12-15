import { AppPage } from './app.po';

describe('Given a user navigates to the home page', () => {
  let page: AppPage;
  beforeAll(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should display welcome message', () => {
    expect(page.getParagraphText()).toEqual('Welcome to ngAccidentStatistics!');
  });

  it('should display a business case for the creating the accident statistics', () => {
    expect(page.getSubHeaderText()).toEqual('Business case for Accident Statistics');
  });

  it('should display an introduction to summarise the business case', () => {
    expect(page.getFirstListItemFirstParagraphText())
      // tslint:disable-next-line:max-line-length
      .toEqual('The business case for accident data can be a visual map of hotspots, a query tool for interrogating information or simply describing what happened with filtered data.');
  });

  it('should display summary information about the components that have been developed', () => {
    expect(page.getFirstListItemSecondParagraphText())
      // tslint:disable-next-line:max-line-length
      .toEqual('Below are examples of 3 such components, the same components configured to show different data or perspectives on certain information.');
  });

  it('should inform the user about the developer options and optimizations that are available like broswer cache', () => {
    expect(page.getFirstListItemThirdParagraphText())
      // tslint:disable-next-line:max-line-length
      .toEqual('Make a point of utilising the developer tools to see the network activity and refresh the page to see the data optimisation the browser cache, or etag caching for 5 minutes at a time.');
  });

  it('should inform the user how they can monitor what happens through the console', () => {
    // page.navigateTo();
    expect(page.getFirstListItemFourthParagraphText())
      // tslint:disable-next-line:max-line-length
      .toEqual('Monitor the console running the Api and make sure that the data is loaded from the TFL server or database, depending on the version of the Api being called, and the second reload shouldshow no activity within the logs, therfore taking the burden off the TFL website and the local web api service calling it or the database.');
  });

  it('should summarise what the components look like and how you can use them', () => {
    expect(page.getSecondListItemFirstParagraphText())
      // tslint:disable-next-line:max-line-length
      .toEqual('These are examples of the component types based on the colour, orange being a map component, yellow being a query component and finally red being the list component.');
  });

  it('should show a map of fatal accidents since January 2005 to December 2017', () => {
    const mapComponent = page.getMapComponent(0);
    expect(mapComponent).toBeTruthy();
    mapComponent.getAttribute('fromDate').then(value => {
      expect(value).toBe('Jan 1, 2005, 12:00:00 AM');
    });
    mapComponent.getAttribute('toDate').then(value => {
      expect(value).toBe('Dec 31, 2017, 11:59:00 PM');
    });
    mapComponent.getAttribute('imageOption').then(value => {
      expect(value).toBe('Macabre');
    });
    mapComponent.getAttribute('severityOption').then(value => {
      expect(value).toBe('Fatal');
    });
    mapComponent.getAttribute('zoom').then(value => {
      expect(value).toBe('11');
    });
  });

  it('should show a second map of serious accidents since December 1 2017 for the rest of December', () => {
    const mapComponent = page.getMapComponent(1);
    expect(mapComponent).toBeTruthy();
    mapComponent.getAttribute('fromDate').then(value => {
      expect(value).toBe('Dec 1, 2017, 12:00:00 AM');
    });
    mapComponent.getAttribute('toDate').then(value => {
      expect(value).toBe('Dec 31, 2017, 11:59:00 PM');
    });
    mapComponent.getAttribute('imageOption').then(value => {
      expect(value).toBe('Friendly');
    });
    mapComponent.getAttribute('severityOption').then(value => {
      expect(value).toBe('Serious');
    });
    mapComponent.getAttribute('zoom').then(value => {
      expect(value).toBe('9');
    });
  });

  it('should show a third map of slight accidents from December 15 2017 for the rest of December', () => {
    const mapComponent = page.getMapComponent(2);
    expect(mapComponent).toBeTruthy();
    mapComponent.getAttribute('fromDate').then(value => {
      expect(value).toBe('Dec 15, 2017, 12:00:00 AM');
    });
    mapComponent.getAttribute('toDate').then(value => {
      expect(value).toBe('Dec 31, 2017, 11:59:00 PM');
    });
    mapComponent.getAttribute('imageOption').then(value => {
      expect(value).toBe('Marker');
    });
    mapComponent.getAttribute('severityOption').then(value => {
      expect(value).toBe('Slight');
    });
    mapComponent.getAttribute('zoom').then(value => {
      expect(value).toBe('10');
    });
  });

  it('should show one query component defaulting to Fatal', () => {
    const queryComponent = page.getQueryComponent();
    expect(queryComponent).toBeTruthy();
    expect(queryComponent.getAttribute('severityOption')).toBe('Fatal');
  });

  it('given I set the from value on the query component to 01/01/2017 I should display data to the user', () => {
    const fromInput = page.getFromInputOnQueryComponent();
    expect(fromInput).toBeTruthy();
    fromInput.sendKeys('01');
    fromInput.sendKeys('01');
    fromInput.sendKeys('2017');
    const preResultElement = page.getPreResultOnQueryComponent();
    expect(preResultElement).toBeTruthy();
    expect(preResultElement.isDisplayed).toBeTruthy();
    preResultElement.getText().then(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should show the first list component displaying fatal accidents date descending with json as an example', () => {
    const listComponent = page.getListComponent(0);
    expect(listComponent).toBeTruthy();
    expect(listComponent.getAttribute('severityOption')).toBe('Fatal');
    expect(listComponent.getAttribute('fromDate')).toBe('Dec 1, 2017, 12:00:00 AM');
    expect(listComponent.getAttribute('toDate')).toBe('Dec 31, 2017, 11:59:00 PM');
    expect(listComponent.getAttribute('orderByOption')).toBe('DateDescending');
    expect(listComponent.getAttribute('showJson')).toBe('true');
  });

  it('should show the second list component displaying fatal accidents date ascending', () => {
    const listComponent = page.getListComponent(1);
    expect(listComponent).toBeTruthy();
    expect(listComponent.getAttribute('severityOption')).toBe('Fatal');
    expect(listComponent.getAttribute('fromDate')).toBe('Dec 1, 2017, 12:00:00 AM');
    expect(listComponent.getAttribute('toDate')).toBe('Dec 31, 2017, 11:59:00 PM');
    expect(listComponent.getAttribute('orderByOption')).toBe('DateAscending');
  });

  it('should show the second list component displaying fatal accidents location ascending', () => {
    const listComponent = page.getListComponent(2);
    expect(listComponent).toBeTruthy();
    expect(listComponent.getAttribute('severityOption')).toBe('Fatal');
    expect(listComponent.getAttribute('fromDate')).toBe('Dec 1, 2017, 12:00:00 AM');
    expect(listComponent.getAttribute('toDate')).toBe('Dec 31, 2017, 11:59:00 PM');
    expect(listComponent.getAttribute('orderByOption')).toBe('LocationAscending');
  });

  it('should show the second list component displaying fatal accidents location descending', () => {
    const listComponent = page.getListComponent(3);
    expect(listComponent).toBeTruthy();
    expect(listComponent.getAttribute('severityOption')).toBe('Fatal');
    expect(listComponent.getAttribute('fromDate')).toBe('Dec 1, 2017, 12:00:00 AM');
    expect(listComponent.getAttribute('toDate')).toBe('Dec 31, 2017, 11:59:00 PM');
    expect(listComponent.getAttribute('orderByOption')).toBe('LocationDescending');
  });

  // TODO: Create more tests for other query options
});
