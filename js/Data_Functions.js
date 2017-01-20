function Forms_List_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGCF',
								'JSON_Form_Data_Load_Query',
								'&Form_ID=' + Form_ID + '&Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ),
								delegator );
}
function Load_Data_JSON_Columns( callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGCF',
								'Load_Data_JSON_Columns',
								'&Form_ID=' + Form_ID,
								delegator );
}
function Data_Batchlist_Insert( fieldlist, callback, delegator ) {
	return AJAX_Call_Module_FieldList( callback,
										'admin',
										'TGCF',
										'Data_Batchlist_Insert',
										'&Form_ID=' + Form_ID,
										fieldlist,
										delegator );
}