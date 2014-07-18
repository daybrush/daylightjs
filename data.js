/*
 * reference to daylight data
 */
var expando = "daylight" + Date.now(), uuid = 0, windowData = {};

daylight.extend({
	cache: {},

	data: function( elem, name, data ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		// Compute a unique ID for the element
		if ( !id )
			id = elem[ expando ] = ++uuid;

		// Only generate the data cache if we're
		// trying to access or manipulate it
		if ( name && !daylight.cache[ id ] )
			daylight.cache[ id ] = {};

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined )
			daylight.cache[ id ][ name ] = data;

		// Return the named cache data, or the ID for the element
		return name ?
			daylight.cache[ id ][ name ] :
			id;
	},

	removeData: function( elem, name ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( daylight.cache[ id ] ) {
				// Remove the section of cache data
				delete daylight.cache[ id ][ name ];

				// If we've removed all the data, remove the element's cache
				name = "";

				for ( name in daylight.cache[ id ] )
					break;

				if ( !name )
					daylight.removeData( elem );
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			// Clean up the element expando
			try {
				delete elem[ expando ];
			} catch(e){
				// IE has trouble directly removing the expando
				// but it's ok with using removeAttribute
				if ( elem.removeAttribute )
					elem.removeAttribute( expando );
			}

			// Completely remove the data cache
			delete daylight.cache[ id ];
		}
	}
});

prototype.extend({
	data: function( key, value ){
		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = daylight.data( this[0], key );
			return data;
			
		} else
			return this.each(function(){
				daylight.data( this, key, value );
			});
	},

	removeData: function( key ){
		return this.each(function(){
			daylight.removeData( this, key );
		});
	}
});