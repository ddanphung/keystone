var React = require('react');
var ReactDOM = require('react-dom');
import async from 'async';
import xhr from 'xhr';
import Select from 'react-select';
import { Button, Checkbox, FormField, FormInput, FormNote, FormRow } from 'elemental';

var lastId = 0;
var goodList = 'goods';

var defaultItem = {goodCode: '', quantity: 0};

function newItem (value) {
	lastId = lastId + 1;
	return {
		key: 'i' + lastId,
		value: value
	};
}

function reduceValues (values) {
	return values.map(i => i.value);
}

module.exports = {

	getInitialState: function() {
		return {
			values: this.props.value.map(newItem)
		};
	},

	componentDidMount: function() {
		this._itemsCache = {};
	},

	addItem: function() {
		var newValues = this.state.values.concat(newItem({goodCode: '', quantity: 0}));
		this.setState({values: newValues});
		this.valueChanged(reduceValues(newValues));
	},

	removeItem: function(i) {
		var newValues = _.without(this.state.values, i);
		this.setState({values: newValues});
		this.valueChanged(reduceValues(newValues));
	},

	updateItem: function(i, nestedFieldName, event) {
		var updatedValues = this.state.values;
		var updateIndex = updatedValues.indexOf(i);
		// updatedValues[updateIndex].value = this.cleanInput ? this.cleanInput(event.target.value) : event.target.value;
		updatedValues[updateIndex].value = updatedValues[updateIndex].value || {};
		updatedValues[updateIndex].value[nestedFieldName] = event.target.value;
		this.setState({values: updatedValues});
		this.valueChanged(reduceValues(updatedValues));
	},

	valueChanged: function(values) {
		this.props.onChange({
			path: this.props.path,
			value: values
		});
	},

	renderUI: function() {
		if (!this.shouldRenderField()) {
			return (
				<FormField label={this.props.label}>{this.renderValue()}</FormField>
			);
		}

		return (
			<div>
				<FormField label={this.props.label}/>
				<FormField className="form-field--secondary">
					<FormRow>
						<FormField label="Good Code" width="one-half" className="form-field--secondary"/>
						<FormField label="Quantity" width="one-half" className="form-field--secondary"/>
					</FormRow>
				</FormField>
				{this.state.values.map(this.renderItem)}
				<Button ref="button" onClick={this.addItem}>Add item</Button>
			</div>
		);
	},

	renderItem: function(item, index) {
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
		const value = this.processInputValue ? this.processInputValue(item.value) : item.value;
		var getRef = (path) => 'item_' + (index + 1) + '_' + path;
		var getName = (path) => this.props.path + '[' + index + '][' + path + ']';
		return (
			<FormField className="form-field--secondary" key={item.key}>
				<FormRow>
					<FormField width="one-half" className="form-field--secondary">
						<Select.Async
							ref={getRef('goodCode')}
							multi={false}
							disabled={false}
							loadOptions={this.loadOptions}
							labelKey="name"
							valueKey="name"
							name={getName('goodCode')}
							onChange={this.selectChanged(value)}
							simpleValue
							value={value.goodCode}
							/>
					</FormField>
					<FormField width="one-half" className="form-field--secondary">
						<FormInput ref={getRef('quantity')} name={getName('quantity')} value={value.quantity} onChange={this.updateItem.bind(this, item, 'quantity')} autoComplete="off" placeholder="Quantity" />
					</FormField>
					<Button type="link-cancel" onClick={this.removeItem.bind(this, item)} className="keystone-relational-button">
						<span className="octicon octicon-x" />
					</Button>
				</FormRow>
			</FormField>
		);
	},

	renderValue: function () {
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
		return (
			<div>
				{this.state.values.map((item, i) => {
					const value = this.formatValue ? this.formatValue(item.value) : item.value;
					return (
						<div key={i} style={i ? { marginTop: '1em' } : null}>
							<Input noedit value={value} />
						</div>
					);
				})}
			</div>
		);
	},

	selectChanged: function(value) {
		return function(selected) {
			value.goodCode = selected;
			this.valueChanged(this.values); // trigger setState
		}.bind(this);
	},

	loadOptions: function(input, callback) {
		// TODO: Implement filters
		xhr({
			// url: Keystone.adminPath + '/api/' + this.props.refList.path + '?basic&search=' + input,
			url: Keystone.adminPath + '/api/' + goodList + '?basic&search=' + input,
			responseType: 'json',
		}, (err, resp, data) => {
			if (err) {
				console.error('Error loading items:', err);
				return callback(null, []);
			}
			data.results.forEach(this.cacheItem);
			callback(null, {
				options: data.results,
				complete: data.results.length === data.count,
			});
		});
	},

	cacheItem: function(item) {
		// item.href = Keystone.adminPath + '/' + this.props.refList.path + '/' + item.id;
		item.href = Keystone.adminPath + '/' + goodList + '/' + item.id;
		this._itemsCache[item.id] = item;
	},
};
