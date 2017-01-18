function Forms_List_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGCF',
								'Form_Load_Query',
								'&Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ),
								delegator );
}
//On Edit
function Forms_Update( id, fieldlist, callback, delegator ) {
	return AJAX_Call_Module_FieldList(	callback,
										'admin',
										'TGCF',
										'Form_Update',
										'Forms_ID=' + encodeURIComponent( id ),
										fieldlist,
										delegator );
}
// On Delete
function Forms_Batchlist_Delete( id, callback, delegator ) {
	return AJAX_Call_Module(callback,
							'admin',
							'TGCF',
							'Form_Delete',
							'Form_Id=' + encodeURIComponent( id ),
							delegator );
}
// On Create
function Forms_Batchlist_Insert( fieldlist, callback, delegator ) {
	return AJAX_Call_Module_FieldList(	callback,
										'admin',
										'TGCF',
										'Form_Insert',
										'',
										fieldlist,
										delegator );
}