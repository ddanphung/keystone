/*!
 * Module dependencies.
 */

var util = require('util'),
	numeral = require('numeral'),
	utils = require('keystone-utils'),
	super_ = require('../Type');

/**
 * Number FieldType Constructor
 * @extends Field
 * @api public
 */

function objectarray(list, path, options) {

	this._nativeType = Object;

	this._underscoreMethods = ['format'];
	this._formatString = (options.format === false) ? false : (options.format || '0,0[.][000000000000]');
	this._defaultSize = 'small';

	if (this._formatString && 'string' !== typeof this._formatString) {
		throw new Error('FieldType.Number: options.format must be a string.');
	}

	objectarray.super_.call(this, list, path, options);

}

/*!
 * Inherit from Field
 */

util.inherits(objectarray, super_);


/**
 * Formats the field value
 *
 * @api public
 */

objectarray.prototype.format = function(item, format) {
	if (format || this._formatString) {
		return ('number' === typeof item.get(this.path)) ? numeral(item.get(this.path)).format(format || this._formatString) : '';
	} else {
		return item.get(this.path) || '';
	}
};

/**
 * Checks if a value is a valid number
 *
 * @api private
 */

function isValidNumber(value) {
	return !isNaN(utils.number(value));
}

/**
 * Checks that a valid array of number has been provided in a data object
 *
 * An empty value clears the stored value and is considered valid
 *
 * @api public
 */

objectarray.prototype.inputIsValid = function(data, required, item) {
	return true;


	var value = this.getValueFromData(data);

	if (required) {
		if (value === undefined && item && item.get(this.path) && item.get(this.path).length) {
			return true;
		}
		if (value === undefined || !Array.isArray(value) || ('string' !== typeof value) || ('number' !== typeof value)) {
			return false;
		}
		if (Array.isArray(value) && !value.length) {
			return false;
		}
	}

	if ('string' === typeof value) {
		if (!isValidNumber(value)) {
			return false;
		}
	}

	if (Array.isArray(value)) {
		for (var index = 0; index < value.length; index++) {
			if (!isValidNumber(value[index])) {
				return false;
			}
		}
	}

	return (value === undefined || Array.isArray(value) || ('string' === typeof value) || ('number' === typeof value));
};

/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */


objectarray.prototype.updateItem = function(item, data) {
	var value = this.getValueFromData(data);
	if ('undefined' !== typeof value) {
		return item.set(this.path, value);

		if (Array.isArray(value)) {
			var temp = value.filter(function(temp) {
				if (isValidNumber(temp)) {
					return utils.number(temp);
				}
			});
			value = temp;
		}
		if (value === null) {
			value = [];
		}
		if ('string' === typeof value) {
			if (isValidNumber(value)) {
				value = [utils.number(value)];
			}
		}
		if ('number' === typeof value) {
			value = [value];
		}
		if (Array.isArray(value)) {
			item.set(this.path, value);
		}
	}

};


/*!
 * Export class
 */

module.exports = objectarray;
