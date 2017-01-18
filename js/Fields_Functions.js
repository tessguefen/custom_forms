function Fields_List_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGCF',
								'Fields_List_Load_Query',
								'&Form_ID=' + Form_ID + '&Filter=' + EncodeArray( filter ) + '&Sort=' + encodeURIComponent( sort ) + '&Offset=' + encodeURIComponent( offset ) + '&Count=' + encodeURIComponent( count ),
								delegator );
}
//On Edit
function Fields_Update( id, fieldlist, callback, delegator ) {
	return AJAX_Call_Module_FieldList(	callback,
										'admin',
										'TGCF',
										'Field_Update',
										'',
										fieldlist,
										delegator );
}
// On Delete
function Fields_Batchlist_Delete( id, callback, delegator ) {
	return AJAX_Call_Module(callback,
							'admin',
							'TGCF',
							'Field_Delete',
							'Field_Id=' + encodeURIComponent( id ),
							delegator );
}
// On Create
function Fields_Batchlist_Insert( fieldlist, callback, delegator ) {
	return AJAX_Call_Module_FieldList(	callback,
										'admin',
										'TGCF',
										'Field_Insert',
										'',
										fieldlist,
										delegator );
}
// On Insert of Option
function Option_Insert( field_id, fieldlist, callback, delegator ) {
	return AJAX_Call_Module_FieldList(	callback,
									'admin',
									'TGCF',
									'Option_Insert',
									'Field_Id=' + field_id,
									fieldlist,
									delegator );
}
// On Update of an Option
function Option_Update( fieldlist, callback, delegator ) {
	return AJAX_Call_Module_FieldList(	callback,
									'admin',
									'TGCF',
									'Option_Update',
									'',
									fieldlist,
									delegator );
}

// On Delete of an Option
function Option_Delete( fieldlist, callback, delegator ) {
	return AJAX_Call_Module_FieldList(	callback,
									'admin',
									'TGCF',
									'Option_Delete',
									'',
									fieldlist,
									delegator );
}