import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: [],
      indexValue: 0,
      textInput: 'Dublin'
    }
  }

  componentDidMount() {
    this.reloadImages();
  }

  Delay = (function() {
    return function(callback, ms) {
      var timer = 0;
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  reloadImages = () => {
    if(this.state.textInput != "") {
      fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+process.env.REACT_APP_API_KEY+'&text='+this.state.textInput+'&sort=relevance&per_page=10&page=1&format=json&nojsoncallback=1')
      .then(function(response){
        return response.json();
      })
      .then(function(j){
        //alert(JSON.stringify(j));
        let picArray = j.photos.photo.map((pic) => {        
          var srcPath = 'https://farm'+pic.farm+'.staticflickr.com/'+pic.server+'/'+pic.id+'_'+pic.secret+'.jpg';
          return(
            <img alt="" src={srcPath} className="picture-main"></img>
          )
        })
        this.setState({pictures: picArray});
      }.bind(this))
    }
  }

  handleChange = (e) => {
    this.setState({textInput: e.target.value});
  }

  nextHandler = () => {
    if (this.state.indexValue == 9) {
      this.setState({indexValue: 0});
    } 
    else {
      var currentIndexValue = this.state.indexValue;
      currentIndexValue++;
      this.setState({indexValue: currentIndexValue});
    }
  }

  previousHandler = () => {
    if (this.state.indexValue == 0) {
      this.setState({indexValue: 9});
    } 
    else {
      var currentIndexValue = this.state.indexValue;
      currentIndexValue--;
      this.setState({indexValue: currentIndexValue});
    }
  }

  render() {
    return ( 
      <div className="App container">
        <h1 className="text-center">Flickr Image Search with React</h1>
        <hr />
        <div>
          Picture #{this.state.indexValue+1}
        </div>
        <p className="App-intro">
          {this.state.pictures[this.state.indexValue]}
        </p>
        <p>
          <input 
            onChange={this.handleChange} 
            onKeyUp={() => this.Delay(function() {
              this.reloadImages();
            }.bind(this), 1000)}
            value={this.state.textInput}>
          </input>
        </p>
        <div>
          <button onClick={this.previousHandler}>Previous</button>&nbsp;
          <button onClick={this.nextHandler}>Next</button>
        </div>
      </div>
    );
  }
}

export default App;