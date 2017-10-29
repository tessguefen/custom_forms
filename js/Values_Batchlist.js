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
								'Data_Load_Query',
								'&Filter=' + EncodeArray( filter ) +
								'&Sort=' + encodeURIComponent( sort ) +
								'&Offset=' + encodeURIComponent( offset ) +
								'&Count=' + encodeURIComponent( count ),
								delegator );
}

function ValuesBatchlist_Function( fieldlist, _function, callback, delegator ) { 
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'TGCD',
									   _function,
									   '',
									   fieldlist,
									   delegator );
}

function ValuesBatchlist( data_id ) {
	var self = this;
	ValuesBatchlist_Load_Fields( data_id, function( response) {
		if ( response.success ) {
			self.fields = response.data.fields;
			self.fields_length = self.fields.length;
			MMBatchList.call( self, 'jsValuesBatchlist' );
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
	columnlist.push(new MMBatchList_Column_Name( 'Field ID', 'field_id', 'field_id').SetAdvancedSearchEnabled(false).SetDisplayInMenu(false).SetDisplayInList(false) );
	for ( i = 0, i_len = self.fields_length; i < i_len; i++ ) {
		if ( self.fields[ i ].type == 'radio' || self.fields[ i ].type == 'select' ) {
			columnlist.push( new Select_Radio_Column( self.fields[ i ] ) );
		} else if ( self.fields[ i ].type == 'image' ) {
			columnlist.push( new MMBatchList_Column_Image_Upload( self.fields[ i ].prompt, 'Fields_' + self.fields[ i ].code, 'Fields:' + self.fields[ i ].code ) );
		} else if ( self.fields[ i ].type == 'checkbox' ) {
			columnlist.push( new MMBatchList_Column_Checkbox( self.fields[ i ].prompt, 'Fields_' + self.fields[ i ].code, 'Fields:' + self.fields[ i ].code ) );
		} else if ( self.fields[ i ].type == 'memo' ) {
			columnlist.push( new MMBatchList_Column_TextArea( 'Edit ' + self.fields[ i ].prompt, self.fields[ i ].prompt, 'Fields_' + self.fields[ i ].code, 'Fields:' + self.fields[ i ].code ) );
		} else if ( self.fields[ i ].type == 'date' ) {
			columnlist.push( new MMBatchList_Column_DateTime( self.fields[ i ].prompt, 'Fields_' + self.fields[ i ].code, 'Fields:' + self.fields[ i ].code ) );
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
		record[ 'Fields_' + self.fields[ i ].code ] = '';
	}
	return record;
}

ValuesBatchlist.prototype.onSave = function( item, callback, delegator ) {
	ValuesBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Data_Update', callback, delegator );
}
ValuesBatchlist.prototype.onInsert = function( item, callback, delegator ) {
	ValuesBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Data_Insert', callback, delegator );
}
ValuesBatchlist.prototype.onDelete = function( item, callback, delegator ) {
	ValuesBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Data_Delete', callback, delegator );
}

function Select_Radio_Column( column ) {
	var self = this;
	MMBatchList_Column_Text.call( this, column.prompt, 'Fields_' + column.code, 'Fields:' + column.code );

	if ( typeof self.retrieveOptions == 'undefined' ) {
		self.retrieveOptions = [];
	}

	self.retrieveOptions[ 'Fields_' + column.code ] = column.options;

	self.SetOnDisplayData( this.onDisplayData );
	self.SetOnDisplayEdit( this.onDisplayEdit );
}
DeriveFrom( MMBatchList_Column_Text, Select_Radio_Column );

Select_Radio_Column.prototype.onDisplayEdit = function( record, item ) {
	var i, i_len;
	var select;
	var self = this;
	var options = self.retrieveOptions[ this.code ];

	select									= newElement( 'select', { 'name': 'type' }, null, null );
	select.options[ select.options.length ] = new Option( 'Select One', '' );

	for ( i = 0, i_len = options.length; i < i_len; i++ ) {
		select.options[ select.options.length ] = new Option( options[ i ].prompt, options[ i ].code );
	}

	for ( i = 0, i_len = select.options.length; i < i_len; i++ )
	{
		if ( select.options[ i ].value == record.type )
		{
			select.selectedIndex = i;
			break;
		}
	}
	return select;
}

Select_Radio_Column.prototype.onDisplayData = function( record ) {
	var text = newElement( 'div', null, null, null );
	console.log(record);

	text.innerHTML = '';

	return text;
}