function FieldsBatchlist_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGCD',
								'Fields_Load_Query',
								'&Filter=' + EncodeArray( filter ) +
								'&Sort=' + encodeURIComponent( sort ) +
								'&Offset=' + encodeURIComponent( offset ) +
								'&Count=' + encodeURIComponent( count ) +
								'&Data_ID=' + Data_ID,
								delegator );
}

function FieldsBatchlist_Function( fieldlist, _function, callback, delegator ) { 
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'TGCD',
									   _function,
									   '',
									   fieldlist,
									   delegator );
}

function FieldsBatchlist_Option_Function( parentlist, fieldlist, _function, callback, delegator ) { 
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'TGCD',
									   _function,
									   'Field_ID=' + parentlist.id +
									   '&Data_ID=' + parentlist.data_id,
									   fieldlist,
									   delegator );
}

function FieldsBatchlist_DisplayOrder( fields, _function, callback, delegator ) {
	var i;
	var parameters = 'Data_ID=' + Data_ID;
	for ( i = 0; i < fields.length; i++ ) {
		parameters += ( parameters.length ? '&' : '' ) + encodeURIComponent( fields[ i ].name ) + '=' + encodeURIComponent( fields[ i ].value );
	}
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'TGCD',
									   _function,
									   parameters,
									   '',
									   delegator );
}

function FieldsBatchlist( data_id ) {
	var self = this;
	self.data_id = data_id;

	MMBatchList.call( self, 'jsFieldsBatchlist' );

	self.branch_options = self.AddBranch( self.CreateColumnList_Options(), 'options' );
	self.Branch_SetCreateFunction( self.branch_options, self.Option_Create );

	self.Branch_SetInsertFunction( self.branch_options, self.Option_Insert );
	self.Branch_SetSaveFunction( self.branch_options, self.Option_Save );
	self.Branch_SetDeleteFunction( self.branch_options, self.Option_Delete );

	self.Feature_Add_RowSupportsChildren_AddHook( self.Field_RowSupportsChildren_Hook );

	self.Feature_Delete_Enable( 'Delete Field(s)' );
	self.Feature_Edit_Enable( 'Edit Field(s)' );
	self.Feature_RowDoubleClick_Enable();

	self.Feature_Add_Enable( 'Add Field', 'Save Field', 'Add Option', 'Cancel', 'Add Field', 'Save Field', 'Add Option', '' );

	self.Feature_SearchBar_SetPlaceholderText( 'Search Fields...' );
	self.SetDefaultSort( 'disp_order', '' );

	self.Feature_DisplayOrder_Enable( 'disp_order', 'Fields_DisplayOrder' );
}

DeriveFrom( MMBatchList, FieldsBatchlist );

FieldsBatchlist.prototype.onLoad = FieldsBatchlist_Load_Query;

FieldsBatchlist.prototype.onCreateRootColumnList = function() {
	var columnlist;
	var self = this;

		self.fields_id				=	new MMBatchList_Column_Name( 'ID', 'id', 'id')
											.SetDisplayInMenu(false)
											.SetDisplayInList(false)
											.SetAdvancedSearchEnabled(false)
											.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
		self.fields_data_id			=	new MMBatchList_Column_Name( 'Data ID', 'data_id', 'data_id')
											.SetDisplayInMenu(false)
											.SetDisplayInList(false)
											.SetAdvancedSearchEnabled(false);
		self.fields_code			=	new MMBatchList_Column_Text( 'Code', 'code', 'code' )
											.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
		self.fields_prompt			=	new MMBatchList_Column_Text( 'Prompt', 'prompt', 'prompt' )
											.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
		self.fields_type			=	new Fields_Column_Type()
											.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
		self.fields_required		=	new MMBatchList_Column_Checkbox( 'Required', 'required', 'required')
											.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
		self.fields_display_order	=	new MMBatchList_Column( 'Display Order', 'disp_order')
										.SetDisplayInList( false )
										.SetSearchable( false )
										.SetSortByField( 'disp_order' )
										.SetUpdateOnModifiedOnly( true ),
	columnlist =
	[
		self.fields_id,
		self.fields_data_id,
		self.fields_code,
		self.fields_prompt,
		self.fields_type,
		self.fields_required,
		self.fields_display_order
	];

	return columnlist;
}

FieldsBatchlist.prototype.CreateColumnList_Options = function() {
	var self = this;
	var columnlist =
	[
		new MMBatchList_Column_Code( 'ID', 'id', 'id' )
				.SetRootColumn( self.fields_id ),
		new MMBatchList_Column_Name( 'Code', 'code', 'code' )
				.SetRootColumn( self.fields_code ),
		new MMBatchList_Column_Name( 'Prompt', 'prompt', 'prompt' )
				.SetRootColumn( self.fields_prompt )
	];

	return columnlist;
}

FieldsBatchlist.prototype.onRetrieveChildBranch = function( item )
{
	if ( !item || !item.root )
	{
		return null;
	}

	return item.branch.children[ 'options' ];
}


// On Save/ Edit
FieldsBatchlist.prototype.onSave = function( item, callback, delegator ) {
	var self = this;
	var original_callback;

	if ( ( item.original_record.type == 'radio' || item.original_record.type == 'select' ) &&
		 ( item.record.type != 'radio' && item.record.type != 'select' ) )
	{
		original_callback	= callback;
		callback			= function( response )
		{
			var i, i_len, child_item, removelist;

			if ( response.success )
			{
				removelist = new Array();

				for ( i = 0, i_len = item.child_indices.length; i < i_len; i++ )
				{
					if ( ( child_item = self.GetListItem( item.child_indices[ i ] ) ) !== null )
					{
						removelist.push( child_item );
					}
				}

				for ( i = 0, i_len = removelist.length; i < i_len; i++ )
				{
					self.DeleteListItem( removelist[ i ] );
				}

				item.child_indices = new Array();
			}

			original_callback( response );
		}
	}
	FieldsBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Field_Update', callback, delegator );
}


FieldsBatchlist.prototype.onCreate = function() {
	var record;

	record			= new Object();
	record.id		= 0;
	record.data_id	= this.data_id;
	record.code		= '';
	record.prompt	= '';
	record.required	= 0;
	record.options	= new Array();

	return record;
}

FieldsBatchlist.prototype.onDelete = function( item, callback, delegator ) {
	FieldsBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Field_Delete', callback, delegator );
}

FieldsBatchlist.prototype.onInsert = function( item, callback, delegator ) {
	FieldsBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Field_Insert', callback, delegator );
}

FieldsBatchlist.prototype.onDisplayOrderSave = function( fieldlist, callback ) {
	console.log( fieldlist );
	FieldsBatchlist_DisplayOrder( fieldlist, 'Field_DisplayOrder_Update', callback, '' );
}



FieldsBatchlist.prototype.Option_Create = function() {
	var record;

	record			= new Object();
	record.id		= 0;
	record.code		= '';
	record.prompt	= '';

	return record;
}

FieldsBatchlist.prototype.Option_Insert = function( item, callback, delegator ) {
	var parent_field = this.GetListItemRecord_Parent( item.index );
	FieldsBatchlist_Option_Function( parent_field, item.record.mmbatchlist_fieldlist, 'Option_Insert', callback, delegator );
}

FieldsBatchlist.prototype.Field_RowSupportsChildren_Hook = function( item ) {
	if ( !item || !item.record ) {
		return false;
	}

	if ( item.record.type != 'radio' && item.record.type != 'select' ){
		return false;
	}

	return true;
} 


FieldsBatchlist.prototype.onProcessLoadedData = function( recordlist, start_index ) {
	var i, j, index, root_index;

	index = start_index;

	for ( i = 0; i < recordlist.length; i++ )
	{
		root_index = index;
		this.ItemList_CreateInsertAtIndex( recordlist[ i ], index++, -1, this.branch_root );

		if ( recordlist[ i ].options )
		{
			for ( j = 0; j < recordlist[ i ].options.length; j++ )
			{
				this.ItemList_CreateInsertAtIndex( recordlist[ i ].options[ j ], index++, root_index, this.branch_options );
			}
		}
	}
}

FieldsBatchlist.prototype.Option_Save = function( item, callback, delegator ) {
	FieldsBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Option_Update', callback, delegator );

}

FieldsBatchlist.prototype.Option_Delete = function( item, callback, delegator ) {
	FieldsBatchlist_Function( item.record.mmbatchlist_fieldlist, 'Option_Delete', callback, delegator );
}

// Column 'type'
function Fields_Column_Type() {
	MMBatchList_Column_Text.call( this, 'Type', 'type', 'type' );

	this.SetOnDisplayData( this.onDisplayData );
	this.SetOnDisplayEdit( this.onDisplayEdit );
}
DeriveFrom( MMBatchList_Column_Text, Fields_Column_Type );

Fields_Column_Type.prototype.onDisplayEdit = function( record, item ) {
	var i, i_len;
	var select;

	select									= newElement( 'select', { 'name': 'type' }, null, null );
	select.options[ select.options.length ] = new Option( 'Radio Buttons', 'radio' );
	select.options[ select.options.length ] = new Option( 'Drop-down List', 'select' );
	select.options[ select.options.length ] = new Option( 'Checkbox', 'checkbox' );
	select.options[ select.options.length ] = new Option( 'Text Field', 'text' );
	select.options[ select.options.length ] = new Option( 'Text Area', 'memo' );
	select.options[ select.options.length ] = new Option( 'Image', 'image' );

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

Fields_Column_Type.prototype.onDisplayData = function( record ) {
	var text = newElement( 'div', null, null, null );

	if ( record.type == 'radio' )					text.innerHTML = 'Radio Buttons';
	else if ( record.type == 'select' )				text.innerHTML = 'Drop-down List';
	else if ( record.type == 'checkbox' )			text.innerHTML = 'Checkbox';
	else if ( record.type == 'text' )				text.innerHTML = 'Text Field';
	else if ( record.type == 'memo' )				text.innerHTML = 'Text Area';
	else if ( record.type == 'image' )				text.innerHTML = 'Image';

	return text;
}