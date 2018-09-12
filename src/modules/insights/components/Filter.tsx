import { ControlLabel } from 'modules/common/components';
import { router } from 'modules/common/utils';
import { KIND_CHOICES as INTEGRATIONS_TYPES } from 'modules/settings/integrations/constants';
import moment from 'moment';
import * as React from 'react';
import Datetime from 'react-datetime';
import Select from 'react-select-plus';
import { FlexItem, FlexRow, InsightFilter, InsightTitle } from '../styles';
import { integrationOptions, selectOptions } from '../utils';

interface IProps {
  brands: any,
  queryParams: any,
  history: any
};

interface IState {
  isChange: boolean,
  integrationType: string,
  brandId: string,
  startDate: string,
  endDate: string
}

class Filter extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      ...props.queryParams,
      // check condition for showing placeholder
      startDate: props.queryParams.startDate
        ? moment(props.queryParams.startDate)
        : '',
      endDate: props.queryParams.endDate
        ? moment(props.queryParams.endDate)
        : '',
      isChange: false
    };
  }

  onTypeChange(value) {
    const integrationType = value ? value.value : '';
    this.setState({ integrationType });
    router.setParams(this.props.history, { integrationType });
  }

  onBrandChange(value) {
    const brandId = value ? value.value : '';
    this.setState({ brandId });
    router.setParams(this.props.history, { brandId });
  }

  onDateInputChange(type, date) {
    this.setState({ [type]: date, isChange: true });
  }

  onFilterByDate(type, date) {
    if (this.state.isChange) {
      const formatDate = date ? moment(date).format('YYYY-MM-DD HH:mm') : null;
      router.setParams(this.props.history, { [type]: formatDate });
    }
  }

  renderIntegrations() {
    const { __ } = this.context;
    const integrations = INTEGRATIONS_TYPES.ALL_LIST;

    return (
      <FlexItem>
        <ControlLabel>Integrations</ControlLabel>
        <Select
          placeholder={__('Choose integrations')}
          value={this.state.integrationType}
          onChange={value => this.onTypeChange(value)}
          optionRenderer={option => (
            <div className="simple-option">
              <span>{option.label}</span>
            </div>
          )}
          options={integrationOptions(integrations)}
        />
      </FlexItem>
    );
  }

  renderBrands() {
    const { __ } = this.context;
    const { brands } = this.props;
    return (
      <FlexItem>
        <ControlLabel>Brands</ControlLabel>

        <Select
          placeholder={__('Choose brands')}
          value={this.state.brandId}
          onChange={value => this.onBrandChange(value)}
          optionRenderer={option => (
            <div className="simple-option">
              <span>{option.label}</span>
            </div>
          )}
          options={selectOptions(brands)}
        />
      </FlexItem>
    );
  }

  render() {
    const { __ } = this.context;
    const props = {
      inputProps: { placeholder: __('Click to select a date') },
      timeFormat: 'HH:mm',
      dateFormat: 'YYYY/MM/DD'
    };

    return (
      <InsightFilter>
        <InsightTitle>{__('Filter')}</InsightTitle>
        <FlexRow>
          {this.renderIntegrations()}
          {this.renderBrands()}
          <FlexItem>
            <ControlLabel>Start date</ControlLabel>
            <Datetime
              {...props}
              value={this.state.startDate}
              onBlur={this.onFilterByDate.bind(this, 'startDate')}
              onChange={this.onDateInputChange.bind(this, 'startDate')}
            />
          </FlexItem>
          <FlexItem>
            <ControlLabel>End date</ControlLabel>
            <Datetime
              {...props}
              value={this.state.endDate}
              onBlur={this.onFilterByDate.bind(this, 'endDate')}
              onChange={this.onDateInputChange.bind(this, 'endDate')}
            />
          </FlexItem>
        </FlexRow>
      </InsightFilter>
    );
  }
}

export default Filter;