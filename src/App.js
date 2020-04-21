import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Customer from './components/customer'
import { render } from '@testing-library/react';
const cus = {
  "id" : 1,
  "name" : "강효석",
  "image" : "https://placeimg.com/64/64/any",
  "gender" : "남",
  "address" : "의정부"
}


class App extends Component {


  render() {
      return (
        <div className="gray-background">
          <Customer id={cus.id} name={cus.name} image={cus.image} gender={cus.gender} job={cus.address}/>
        </div>
      );
    } 
}

export default App;
