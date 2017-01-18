function Forms_Batchlist() {
	MMBatchList.call( this, 'Forms_Batchlist_id' );
	this.Feature_SearchBar_SetPlaceholderText( 'Search Forms...' );
	this.SetDefaultSort( 'id', '' );
	this.Feature_Delete_Enable('Delete Form(s)');
	this.Feature_Edit_Enable('Edit Form(s)');
	this.Feature_RowDoubleClick_Enable();
	if ( TGCF_Tab == 'TGCF_SETT' ) {
		this.Feature_GoTo_Enable('Edit Form Fields', '');
	} else {
		this.Feature_GoTo_Enable('View Form Data', '');
	}
	this.Feature_Add_Enable('Add New Form');
}

DeriveFrom( MMBatchList, Forms_Batchlist );

Forms_Batchlist.prototype.onLoad = Forms_List_Load_Query;

Forms_Batchlist.prototype.onCreateRootColumnList = function() {
	var columnlist =
	[
		new MMBatchList_Column_Name( 'ID', 'id', 'id')
			.SetDisplayInMenu(false)
			.SetDisplayInList(false)
			.SetAdvancedSearchEnabled(false),
		new MMBatchList_Column_Text( 'Code', 'code', 'code' ),
		new MMBatchList_Column_Text( 'Name', 'name', 'name' )
	];
	return columnlist;
}

// On Save/ Edit
Forms_Batchlist.prototype.onSave = function( item, callback, delegator ) {
	var wrapped_callback = function( response ) {callback( response );}
	Forms_Update( item.record.id, item.record.mmbatchlist_fieldlist, wrapped_callback, delegator );
}
// On Delete
Forms_Batchlist.prototype.onDelete = function( item, callback, delegator ) {
	Forms_Batchlist_Delete( item.record.id, callback, delegator );
}
// on Goto
Forms_Batchlist.prototype.onGoTo = function( item, e ) {
	return OpenLinkHandler( e, adminurl, { 'Screen': 'SMOD', 'Store_Code': Store_Code, 'Tab': TGCF_Tab, 'Form_ID': item.record.id, 'Module_Type': 'system' } );
}
// On Create
Forms_Batchlist.prototype.onCreate = function() {
	var record;
	record = new Object();
	record.id = 0;
	record.code = '';
	record.name = '';
	return record;
}
// On Insert
Forms_Batchlist.prototype.onInsert = function( item, callback, delegator ) {
	Forms_Batchlist_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}