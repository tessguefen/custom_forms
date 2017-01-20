function Data_Batchlist() {
	var self = this;

	Load_Data_JSON_Columns( function( response )
	{
		if ( response.success )
		{
			self.formFields = response.data;
			MMBatchList.call( self, 'Data_Batchlist_id' );
			self.Feature_SearchBar_SetPlaceholderText( 'Search Data...' );
			self.SetDefaultSort( 'id', '' );
			self.Feature_Add_Enable('Add Data');
			//this.Feature_Delete_Enable('Delete Data');
		}
	} );
}

DeriveFrom( MMBatchList, Data_Batchlist );

Data_Batchlist.prototype.onLoad = Forms_List_Load_Query;

Data_Batchlist.prototype.onCreateRootColumnList = function() {

	var i, i_len, columnlist;
	var self = this;

	columnlist =
	[
		new MMBatchList_Column_Name( 'ID', 'id', 'id')
			.SetDisplayInMenu(false)
			.SetDisplayInList(false)
			.SetAdvancedSearchEnabled(false)
	];

	for ( i = 0, i_len = self.formFields.length; i < i_len; i++ ) {
		if (self.formFields[ i ].type == 'checkbox') {
			columnlist.push( new MMBatchList_Column_Checkbox( self.formFields[ i ].name, self.formFields[ i ].field_name, self.formFields[ i ].field_name ) );
		} else {
			columnlist.push( new MMBatchList_Column_Text( self.formFields[ i ].name, self.formFields[ i ].field_name, self.formFields[ i ].field_name ) );
		}
	}
	
	return columnlist;
}

Data_Batchlist.prototype.onCreate = function() {
	var record;
	record = new Object();
	record.id = 0;
	for ( i = 0, i_len = this.formFields.length; i < i_len; i++ ) {
		var code = this.formFields[ i ].field_name;
		record[ code ] = '';
	}
	return record;
}
// On Create
Data_Batchlist.prototype.onInsert = function( item, callback, delegator ) {
	Data_Batchlist_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}