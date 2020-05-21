import React from 'react';
import axios from 'axios';
import lodash from 'lodash';
import TextField from '@material-ui/core/TextField';

const searchAPi = async (text)  => axios.get("https://country.register.gov.uk/records.json?page-size=5000");
class SearchEngine extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value : "",

        }
    }
    seachAsync = async()=>{
        lodash.debounce(this.handleChange, 700);
    }
    handleChange = value =>{
        this.setState({
            value : value
        })
    }
    render(){
        <TextField
          id="outlined-select-currency-native"
          select
          label="Native select"
          value={this.state.value}
          onChange={this.handleChange}
          SelectProps={{
            native: true,
          }}
          helperText="Please select your currency"
          variant="outlined"
        >
          {currencies.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
    }
}