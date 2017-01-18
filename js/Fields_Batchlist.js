function Fields_Batchlist( form_id ) {
	this.form_id = form_id;

	MMBatchList.call( this, 'Fields_Batchlist_id' );

	this.branch_options = this.AddBranch( this.CreateColumnList_Options(), 'options' );
	this.Branch_SetCreateFunction( this.branch_options, this.Option_Create );

	this.Branch_SetInsertFunction( this.branch_options, this.Option_Insert );
	this.Branch_SetSaveFunction( this.branch_options, this.Option_Save );
	this.Branch_SetDeleteFunction( this.branch_options, this.Option_Delete );

	this.Feature_Add_RowSupportsChildren_AddHook( this.Field_RowSupportsChildren_Hook );

	this.Feature_Delete_Enable( 'Delete Field(s)' );
	this.Feature_Edit_Enable( 'Edit Field(s)' );
	this.Feature_RowDoubleClick_Enable();

	this.Feature_Add_Enable( 'Add Field', 'Save Field', 'Add Option', 'Cancel', 'Add Field', 'Save Field', 'Add Option', '' );

	this.Feature_Buttons_AddButton_Persistent( 'Back to All Forms', 'Back to All Forms', 'back_to_forms', this.goback );
	this.Feature_SearchBar_SetPlaceholderText( 'Search Fields...' );
	this.SetDefaultSort( 'id', '' );
}

DeriveFrom( MMBatchList, Fields_Batchlist );

Fields_Batchlist.prototype.onLoad = Fields_List_Load_Query;

Fields_Batchlist.prototype.onCreateRootColumnList = function() {
	var columnlist;

		this.fields_id				=	new MMBatchList_Column_Name( 'ID', 'id', 'id')
											.SetDisplayInMenu(false)
											.SetDisplayInList(false)
											.SetAdvancedSearchEnabled(false)
											.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
		this.fields_form_id			=	new MMBatchList_Column_Name( 'Form ID', 'form_id', 'form_id')
											.SetDisplayInMenu(false)
											.SetDisplayInList(false)
											.SetAdvancedSearchEnabled(false)
											.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
		this.fields_code			=	new MMBatchList_Column_Text( 'Code', 'code', 'code' )
											.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
		this.fields_prompt			=	new MMBatchList_Column_Text( 'Prompt', 'prompt', 'prompt' )
											.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
		this.fields_type			=	new Fields_Column_Type()
											.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
		this.fields_required		=	new MMBatchList_Column_Checkbox( 'Required', 'required', 'required')
											.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
		this.fields_display_order	=	new MMBatchList_Column_Name( 'Display Order', 'disp_order', 'disp_order')
										.SetDisplayInMenu(false)
											.SetDisplayInList(false)
											.SetAdvancedSearchEnabled(false)
											.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
	columnlist =
	[
		this.fields_id,
		this.fields_form_id,
		this.fields_code,
		this.fields_prompt,
		this.fields_type,
		this.fields_required,
		this.fields_display_order
	];

	return columnlist;
}

Fields_Batchlist.prototype.CreateColumnList_Options = function()
{
	var columnlist =
	[
		new MMBatchList_Column_Code( 'ID', 'id', 'id' )
				.SetRootColumn( this.fields_id ),
		new MMBatchList_Column_Name( 'Code', 'code', 'code' )
				.SetRootColumn( this.fields_code ),
		new MMBatchList_Column_Name( 'Prompt', 'prompt', 'prompt' )
				.SetRootColumn( this.fields_prompt )
	];

	return columnlist;
}

Fields_Batchlist.prototype.onRetrieveChildBranch = function( item )
{
	if ( !item || !item.root )
	{
		return null;
	}

	return item.branch.children[ 'options' ];
}


// On Save/ Edit
Fields_Batchlist.prototype.onSave = function( item, callback, delegator ) {
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
	Fields_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}
// On Delete
Fields_Batchlist.prototype.onDelete = function( item, callback, delegator ) {
	Fields_Batchlist_Delete( item.record.id, callback, delegator );
}

// On Create
Fields_Batchlist.prototype.onCreate = function() {
	var record;

	record			= new Object();
	record.id		= 0;
	record.form_id	= this.form_id;
	record.code		= '';
	record.prompt	= '';
	record.required	= 0;
	record.options	= new Array();

	return record;
}
// On Insert
Fields_Batchlist.prototype.onInsert = function( item, callback, delegator ) {
	Fields_Batchlist_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}
// Go Back
Fields_Batchlist.prototype.goback = function( e ) {
	return OpenLinkHandler( e, adminurl, { 'Screen': 'SMOD', 'Store_Code': Store_Code, 'Tab': 'TGCF_SETT', 'Module_Type': 'system' } );
}


Fields_Batchlist.prototype.Option_Create = function() {
	var record;

	record			= new Object();
	record.id		= 0;
	record.code		= '';
	record.prompt	= '';

	return record;
}

Fields_Batchlist.prototype.Option_Insert = function( item, callback, delegator ) {
	var parent_field = this.GetListItemRecord_Parent( item.index );
	Option_Insert(parent_field.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

Fields_Batchlist.prototype.Field_RowSupportsChildren_Hook = function( item ) {
	if ( !item || !item.record ) {
		return false;
	}

	if ( item.record.type != 'radio' && item.record.type != 'select' ){
		return false;
	}

	return true;
} 


Fields_Batchlist.prototype.onProcessLoadedData = function( recordlist, start_index ) {
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

Fields_Batchlist.prototype.Option_Save = function( item, callback, delegator ) {
	Option_Update( item.record.mmbatchlist_fieldlist, callback, delegator );
}

Fields_Batchlist.prototype.Option_Delete = function( item, callback, delegator ) {
	Option_Delete( item.record.mmbatchlist_fieldlist, callback, delegator );
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

	return text;
}