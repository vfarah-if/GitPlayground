import { browser, by, element, WebElement } from 'protractor';
import { WebdriverWebElement } from 'protractor/built/element';

// https://www.protractortest.org for more information 

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getSubHeaderText(): any {
    return element(by.css('app-root > h2')).getText();
  }

  getFirstListItemFirstParagraphText(): any {
    return element(by.css('app-root > ul > li:nth-child(1) > p:nth-child(1)')).getText();
  }

  getFirstListItemSecondParagraphText(): any {
    return element(by.css('app-root > ul > li:nth-child(1) > p:nth-child(2)')).getText();
  }

  getFirstListItemThirdParagraphText(): any {
    return element(by.css('app-root > ul > li:nth-child(1) > p:nth-child(3)')).getText();
  }

  getFirstListItemFourthParagraphText(): any {
    return element(by.css('app-root > ul > li:nth-child(1) > p:nth-child(4)')).getText();
  }

  getSecondListItemFirstParagraphText(): any {
    return element(by.css('app-root > ul > li:nth-child(2) > p:nth-child(1)')).getText();
  }

  getMapComponent(mapComponentIndex: number): WebElement {
    return element.all(by.css('app-accident-statistic-map')).get(mapComponentIndex);
  }

  getListComponent(listComponentIndex: number): any {
    return element.all(by.css('app-accident-statistic-list')).get(listComponentIndex)
  }

  getQueryComponent(): WebElement {
    return element(by.css('app-accident-statistic-query'));
  }

  getFromInputOnQueryComponent(): WebElement {
    return element(by.css('app-accident-statistic-query input[name=from]'));
  }

  getPreResultOnQueryComponent(): WebElement {
    return element(by.css('app-accident-statistic-query pre[name=out-json]'));
  }
}
