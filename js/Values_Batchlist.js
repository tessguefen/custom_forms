function ValuesBatchlist_Load_Fields( data_id, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGCD',
								'Load_Fields',
								'Data_ID=' + data_id,
								delegator );
}

function ValuesBatchlist_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGCD',
								'JSON_Values_Load_Query',
								'&Filter=' + EncodeArray( filter ) +
								'&Sort=' + encodeURIComponent( sort ) +
								'&Offset=' + encodeURIComponent( offset ) +
								'&Count=' + encodeURIComponent( count ) +
								'&Data_ID=' + Data_ID,
								delegator );
}

function ValuesBatchlist_Function( fieldlist, _function, callback, delegator ) { 
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'TGCD',
									   _function,
									   'Data_ID=' + Data_ID,
									   fieldlist,
									   delegator );
}

function ValuesBatchlist_Checkbox_Function( fieldlist, field_name, checked, delegator ) {
	fieldlist.forEach( function(field) {
		if ( field.name == field_name ) {
			field.value = ( checked ? 1 : 0 );
		}
	});
	ValuesBatchlist_Function( fieldlist, 'Values_Update', function( response ) {}, delegator );
}

function ValuesBatchlist( data_id ) {
	var self = this;
	ValuesBatchlist_Load_Fields( data_id, function( response) {
		if ( response.success ) {
			self.fields = response.data.fields;
			self.fields_length = self.fields.length;
			MMBatchList.call( self, 'jsValuesBatchlist' + data_id );
			self.Feature_SearchBar_SetPlaceholderText( 'Search Data...' );
			self.SetDefaultSort( 'id', '-' );
			self.Feature_Add_Enable('Add Data');
			self.Feature_Edit_Enable('Edit Data(s)');
			self.Feature_Delete_Enable('Delete Data(s)');
			self.Feature_RowDoubleClick_Enable();
			self.processingdialog = new ProcessingDialog();
		}
	});
}

DeriveFrom( MMBatchList, ValuesBatchlist );

ValuesBatchlist.prototype.onLoad = ValuesBatchlist_Load_Query;

ValuesBatchlist.prototype.onCreateRootColumnList = function() {
	var self = this;
	var columnlist = [];
	columnlist.push(new MMBatchList_Column_Name( 'Group ID', 'group_id', 'group_id').SetAdvancedSearchEnabled(false).SetDisplayInMenu(false).SetDisplayInList(false) );
	for ( i = 0, i_len = self.fields_length; i < i_len; i++ ) {
		if ( self.fields[ i ].type == 'radio' || self.fields[ i ].type == 'select' ) {
			columnlist.push( new Select_Radio_Column( self.fields[ i ] ) );
		} else if ( self.fields[ i ].type == 'image' ) {
			columnlist.push( new MMBatchList_Column_Image_Upload( self.fields[ i ].prompt, 'Fields_' + self.fields[ i ].code, 'Fields:' + self.fields[ i ].code ) );
		} else if ( self.fields[ i ].type == 'memo' ) {
			columnlist.push( new MMBatchList_Column_TextArea( 'Edit ' + self.fields[ i ].prompt, self.fields[ i ].prompt, 'Fields_' + self.fields[ i ].code, 'Fields:' + self.fields[ i ].code ) );
		} else if ( self.fields[ i ].type == 'date' ) {
			columnlist.push(
				new MMBatchList_Column_DateTime( self.fields[ i ].prompt, 'Fields_' + self.fields[ i ].code, 'Fields:' + self.fields[ i ].code )
				.SetOnDisplayEdit( function( record ) {
					var current_val = record[ this.code ];
					if ( !current_val ) { var current_val = ( ( new Date() ).getTime() ) / 1000; }
					return DrawMMBatchListDateTime_Edit( this.code, current_val );
				} )
			);
		} else if ( self.fields[ i ].type == 'checkbox' ) {
			columnlist.push( new MMBatchList_Column_CheckboxSlider( self.fields[ i ].prompt, 'Fields_' + self.fields[ i ].code, 'Fields:' + self.fields[ i ].code, function( item, checked, delegator ) { ValuesBatchlist_Checkbox_Function( item.record.mmbatchlist_fieldlist, this.field_name, checked, delegator ); }));
		} else {
			columnlist.push( new MMBatchList_Column_Name( self.fields[ i ].prompt, 'Fields_' + self.fields[ i ].code, 'Fields:' + self.fields[ i ].code ) );
		}
	}
	return columnlist;
}

ValuesBatchlist.prototype.onCreate = function() {
	var self = this;
	var record;
	record = new Object();
	record.group_id = 0;
	for ( i = 0, i_len = self.fields_length; i < i_len; i++ ) {
		if ( self.fields[ i ].type == 'date' ) {
			record[ 'Fields_' + self.fields[ i ].code ] = Math.floor(Date.now() / 1000);
		} else {
			record[ 'Fields_' + self.fields[ i ].code ] = '';
		}
	}
	return record;
}

ValuesBatchlist.prototype.onSave = function( item, callback, delegator ) {
	ValuesBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Values_Update', callback, delegator );
}
ValuesBatchlist.prototype.onInsert = function( item, callback, delegator ) {
	ValuesBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Values_Insert', callback, delegator );
}
ValuesBatchlist.prototype.onDelete = function( item, callback, delegator ) {
	ValuesBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Values_Delete', callback, delegator );
}

function Select_Radio_Column( column ) {
	var self = this;
	MMBatchList_Column_Text.call( this, column.prompt, 'Fields_' + column.code, 'Fields:' + column.code );

	if ( typeof self.retrieveOptions == 'undefined' ) {
		self.retrieveOptions = [];
	}

	if ( !self.retrieveOptions[ 'Fields_' + column.code ] ) {
		self.retrieveOptions[ 'Fields_' + column.code ] = column.options;
	}

	self.SetOnDisplayData( this.onDisplayData );
	self.SetOnDisplayEdit( this.onDisplayEdit );
}
DeriveFrom( MMBatchList_Column_Text, Select_Radio_Column );

Select_Radio_Column.prototype.onDisplayEdit = function( record, item ) {
	var i, i_len;
	var select;
	var self = this;
	var selected = record[ this.code ];
	var field_options = self.retrieveOptions[ this.code ];

	select									= newElement( 'select', { 'name': self.code }, null, null );
	//select.options[ select.options.length ] = new Option( 'Select One', '' );

	for ( i = 0, i_len = field_options.length; i < i_len; i++ ) {
		select.options[ select.options.length ] = new Option( field_options[ i ].prompt, field_options[ i ].prompt );
	}
	if ( selected ) {
		for ( i = 0, i_len = select.options.length; i < i_len; i++ )
		{
			if ( select.options[ i ].value == selected )
			{
				select.selectedIndex = i;
				break;
			}
		}
	}
	return select;
}

Select_Radio_Column.prototype.onDisplayData = function( record ) {
	var text = newElement( 'div', null, null, null );
	text.innerHTML = record[ this.code ];
	return text;
}