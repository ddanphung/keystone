import React from 'react';
import CloudinaryImageSummary from '../../components/columns/CloudinaryImageSummary';
import ItemsTableCell from '../../../admin/client/components/ItemsTableCell';
import ItemsTableValue from '../../../admin/client/components/ItemsTableValue';

const moreIndicatorStyle = {
	color: '#888',
	fontSize: '.8rem',
};

var CloudinaryImagesColumn = React.createClass({
	displayName: 'CloudinaryImagesColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderMany (value) {
		if (!value || !value.length) return;
		let refList = this.props.col.field.refList;
		let items = [];
		for (let i = 0; i < 3; i++) {
			if (!value[i]) break;
			items.push(<CloudinaryImageSummary key={'image' + i} image={value[i]} />);
		}
		if (value.length > 3) {
			items.push(<span key="more" style={moreIndicatorStyle}>[...{value.length - 3} more]</span>);
		}
		return items;
	},
	renderValue (value) {
		if (!value || !Object.keys(value).length) return;

		return <CloudinaryImageSummary image={value} />;

	},
	render () {
		let value = this.props.data.fields[this.props.col.path];
		let many = value.length > 1;

		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type}>
					{many ? this.renderMany(value) : this.renderValue(value[0])}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	}
});

module.exports = CloudinaryImagesColumn;
