function DataBatchlist_Load_Query( filter, sort, offset, count, callback, delegator ) {
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

function DataBatchlist_Function( fieldlist, _function, callback, delegator ) { 
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'TGCD',
									   _function,
									   '',
									   fieldlist,
									   delegator );
}

function DataBatchlist() {
	var self = this;
	MMBatchList.call( self, 'jsDataBatchlist' );
	self.Feature_SearchBar_SetPlaceholderText( 'Search Data Sets...' );
	self.SetDefaultSort( 'id', '' );
	self.Feature_Add_Enable('Add Data Set');
	self.Feature_Edit_Enable('Edit Data Set(s)');
	self.Feature_Delete_Enable('Delete Data Set(s)');
	self.Feature_RowDoubleClick_Enable();
	self.processingdialog = new ProcessingDialog();
}

DeriveFrom( MMBatchList, DataBatchlist );

DataBatchlist.prototype.onLoad = DataBatchlist_Load_Query;

DataBatchlist.prototype.onCreateRootColumnList = function() {
	var columnlist =
	[
		new MMBatchList_Column_Name( 'Data ID', 'id', 'id')
		.SetAdvancedSearchEnabled(false)
		.SetDisplayInMenu(false)
		.SetDisplayInList(false)
		.SetAdvancedSearchEnabled(false),
		new MMBatchList_Column_Code( 'Code', 'code', 'code'),
		new MMBatchList_Column_Name( 'Name', 'name', 'name')
	];
	return columnlist;
}

DataBatchlist.prototype.onCreate = function() {
	var record;
	record = new Object();
	record.id = 0;
	record.code = '';
	record.name = '';
	return record;
}

DataBatchlist.prototype.onSave = function( item, callback, delegator ) {
	DataBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Data_Update', callback, delegator );
}
DataBatchlist.prototype.onInsert = function( item, callback, delegator ) {
	DataBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Data_Insert', callback, delegator );
}
DataBatchlist.prototype.onDelete = function( item, callback, delegator ) {
	DataBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Data_Delete', callback, delegator );
}