import React from 'react';
import { RULES } from '../redux/modules/lists';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';

const options = [
  {value: RULES.DUE_DATE_REQUIRED, label: 'Due Date Required'},
  {value: RULES.URGENT, label: 'Priority 1'},
  {value: RULES.DUE_EOW, label: 'Due at the End of the Week'},
  {value: RULES.BACKLOG, label: 'Clear Due Date'}
];

export default class ListRuleModal extends React.Component {
  constructor(props){
    super(props);
    this.state = ({
      values: [],
    });
  }

  handleChange = (selectedOptions) => {
    console.log(selectedOptions);
    this.state.values = [];
    for (let i in selectedOptions){
      this.state.values.push(selectedOptions[i].value);
    }
    console.log("values", this.state.values);
  };

  render(){
    return (
      <div className={this.props.show ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <h1>Apply Rules for {this.props.list.title}</h1>
          <Select
            isMulti
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={this.handleChange}
            components={makeAnimated()}
          />
          <div className="modal-buttons">
            <button onClick={() => this.props.handleClose(this.state.values)}> Close </button>
          </div>
        </section>
      </div>
    );
  };

};

