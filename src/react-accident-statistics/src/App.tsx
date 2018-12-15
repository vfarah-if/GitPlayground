import * as React from 'react';
import Hello from './components/hello';
import logo from './logo.svg';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, faKey } from '@fortawesome/free-solid-svg-icons';
import AccidentStatisticsMap from './components/accident-statistics-map/accident-statistics-map';
import AccidentStatisticsList from './components/accident-statistics-list/accident-statistics-list';
library.add(fas, faKey);

class App extends React.Component {
  public render() {
    return (
      <div className="app">
        <header className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <h1 className="app-title">Welcome to React Accident Statistics</h1>
        </header>
        <Hello name=", I love being a crafstman!" enthusiasmLevel={10} />
        <AccidentStatisticsMap fromDate="Jan 1, 2010, 12:00:00 AM" toDate="Dec 31, 2017, 11:59:00 PM" severityOption="Fatal" imageOption="Macarbe" zoom={11}/>
        <AccidentStatisticsMap fromDate="Dec 1, 2017, 12:00:00 AM" toDate="Dec 31, 2017, 11:59:00 PM" severityOption="Serious" imageOption="Friendly" zoom={9}/>
        <AccidentStatisticsMap fromDate="Dec 15, 2017, 12:00:00 AM" toDate="Dec 31, 2017, 11:59:00 PM" severityOption="Slight" imageOption="Marker" zoom={10} useGeolocationPosition={true}/>
        <AccidentStatisticsList severityOption="Fatal" fromDate="Dec 1, 2017, 12:00:00 AM" toDate="Dec 31, 2017, 11:59:00 PM" orderByOption="DateDescending" showJson={true}/>        
        <AccidentStatisticsList severityOption="Fatal" fromDate="Dec 1, 2017, 12:00:00 AM" toDate="Dec 31, 2017, 11:59:00 PM" orderByOption="DateAscending"/>        
        <AccidentStatisticsList severityOption="Fatal" fromDate="Dec 1, 2017, 12:00:00 AM" toDate="Dec 31, 2017, 11:59:00 PM" orderByOption="LocationAscending"/>        
        <AccidentStatisticsList severityOption="Fatal" fromDate="Dec 1, 2017, 12:00:00 AM" toDate="Dec 31, 2017, 11:59:00 PM" orderByOption="LocationDescending"/>        
        <AccidentStatisticsList severityOption="Serious" fromDate="Dec 24, 2017, 12:00:00 AM" toDate="Dec 31, 2017, 11:59:00 PM"/>        
      </div>
    );
  }
}

export default App;
