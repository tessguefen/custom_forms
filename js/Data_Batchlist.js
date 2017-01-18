function Data_Batchlist() {
	var self = this;
	this.Feature_SearchBar_SetPlaceholderText( 'Search Data...' );
	this.SetDefaultSort( 'id', '' );
	//this.Feature_Delete_Enable('Delete Data');

	Load_Data_JSON_Columns( function( response )
	{
		if ( response.success )
		{
			self.formFields = response.data;
			MMBatchList.call( self, 'Data_Batchlist_id' );
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
		columnlist.push( new MMBatchList_Column_Text( self.formFields[ i ].name, self.formFields[ i ].field_name, self.formFields[ i ].field_name ) );
	}

	console.log(columnlist);
	
	return columnlist;
}