import React from 'react';
import { RULES } from '../redux/modules/lists';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';

const options = [
  {value: RULES.DUE_DATE_REQUIRED, label: RULES.DUE_DATE_REQUIRED},
  {value: RULES.URGENT, label: RULES.URGENT},
  {value: RULES.DUE_EOW, label: RULES.DUE_EOW},
  {value: RULES.BACKLOG, label: RULES.BACKLOG}
];

export default class ListRuleModal extends React.Component {
  constructor(props){
    super(props);
    this.state = ({
      values: [],
      defaultValue: [],
    });
  }

  handleChange = (selectedOptions) => {
    let selected = [];
    for (let i in selectedOptions){
      selected.push(selectedOptions[i].value);
    }
    this.setState({
      values: selected,
      defaultValue: selected,
    });
  };

  componentDidMount(){
/*    let defaultOptions = [];
    this.props.list.rules.map(rule => {
      defaultOptions.push({value: rule, label: rule});
    });
    this.setState({
      defaultValue: defaultOptions,
    });*/
  }

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

