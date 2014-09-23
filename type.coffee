# type.js - A tiny Javascript type-check library, written in Coffeescript.
#
# Copyright (c) 2014 Dennis Raymondo van der Sluis
#
# This program is free software: you can redistribute it and/or modify
#     it under the terms of the GNU General Public License as published by
#     the Free Software Foundation, either version 3 of the License, or
#     (at your option) any later version.
#
#     This program is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU General Public License for more details.
#
#     You should have received a copy of the GNU General Public License
#     along with this program.  If not, see <http://www.gnu.org/licenses/>

"use strict"

Type= {}

testValues= ( predicate, breakState, values= [] ) ->
	return false if arguments[2].length < 1
	for value in arguments[2]
		return breakState if (predicate value) is breakState
	return not breakState

hasType=
	'Undefined'	: (value) -> value is undefined
	'Null'		: (value) -> value is null
	'Boolean'	: (value) -> typeof value is 'boolean'
	'String'		: (value) -> typeof value is 'string'
	'Function'	: (value) -> typeof value is 'function'
	'Number'		: (value) -> (typeof value is 'number') and (value is value)
	'Array'		: (value) -> (typeof value is 'object') and ( value instanceof Array )
	'RegExp'		: (value) -> value instanceof RegExp
	'Date'		: (value) -> value instanceof Date
	'Object'		: (value) -> (typeof value is 'object') and not (value instanceof Array) and not (value instanceof RegExp) and not (value is null)
	'NaN'			: (value) -> (typeof value is 'number') and (value isnt value)

breakIfEqual= true
do -> for name, predicate of hasType then do ( name, predicate ) ->
	Type[ 'is'+ name ]	= predicate
	Type[ 'not'+ name ]	= ( value ) -> not predicate value
	Type[ 'has'+ name ]	= -> testValues predicate, breakIfEqual, arguments
	Type[ 'all'+ name ]	= -> testValues predicate, not breakIfEqual, arguments

Type.typeof= ( value ) ->
	for type, predicate of hasType
		return type.toLowerCase() if predicate(value) is true
	return 'unknown'

if window? then window.Type= Type
else if module then module.exports= Type