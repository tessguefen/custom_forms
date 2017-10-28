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
	for ( i = 0, i_len = self.fields_length; i < i_len; i++ ) {
		console.log( self.fields[ i ]);
		if ( self.fields[ i ].type == 'radio' || self.fields[ i ].type == 'select' ) {
			columnlist.push( new MMBatchList_Column_Text( self.fields[ i ].prompt, 'Fields_' + self.fields[ i ].code, 'Fields:' + self.fields[ i ].code ) );
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
	console.log(record);
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