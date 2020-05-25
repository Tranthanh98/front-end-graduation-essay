import React from 'react';
import axios from 'axios';
import lodash from 'lodash';
import TextField from '@material-ui/core/TextField';
import * as httpClient from '../../core/HttpClient';

const searchAPi = async (text)  => axios.get("https://country.register.gov.uk/records.json?page-size=5000");
class SearchEngine extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value : "",
            listClass : [],
            selected : ""
        }
        this.searchAsync = lodash.debounce(this.searchEngineAsync, 1000);
    }
    searchEngineAsync = async()=>{
      let data = {
        className : this.state.value
      }
        let response = await httpClient.sendPost('/search-class', data);
        console.log("response :", response);
        this.setState({
          listClass : response.data.Data.data
        })
    }
    handleChange = async(e) =>{
        await this.setState({
            value : e.target.value
        })
        await this.searchAsync();
    }
    _hanldeSelected = (e)=>{
      this.setState({
        selected : e.target.value
      })
    }
    render(){
      return(
        <TextField
          id="outlined-select-currency-native"
          label="Native select"
          value={this.state.value}
          onChange={(e) => this.handleChange(e)}
          SelectProps={{
            native: true,
          }}
          helperText="Please select your currency"
          variant="outlined"
        >
          <select value={this.state.selected} onChange={(e)=> this._hanldeSelected(e)}>
            {this.state.listClass.map((option) => (
              <option key={option.ma_mon} value={option.ten_mon}>
                {option.ten_mon}
              </option>
            ))}
          </select>
          
        </TextField>
      );
    }
}
export default SearchEngine;