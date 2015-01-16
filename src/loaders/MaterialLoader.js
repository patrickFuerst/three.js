/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.MaterialLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.MaterialLoader.prototype = {

	constructor: THREE.MaterialLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json ) {

		function loadTextures( where, attr, sourceFiles, repeat, offset, wrap, anisotropy, mapping, filter, format, type, name ) {
			// this function is from Loader.js,  @author alteredq / http://alteredqualia.com/
			function error(e){
				console.warn("Couldn't load texture");
			}

			var texture;

			if ( sourceFiles instanceof Array ) {

				var loader = THREE.Loader.Handlers.get( sourceFiles[ 0 ] );

				if ( loader !== null ) {

					texture = loader.load( sourceFiles );

					if ( mapping !== undefined )
						texture.mapping = mapping;

				} else {

					texture = THREE.ImageUtils.loadTextureCube( sourceFiles, mapping,undefined, error );

				}

			} else {

				var loader = THREE.Loader.Handlers.get( sourceFiles );

				if ( loader !== null ) {

					texture = loader.load( sourceFiles  );

				} else {

					texture = THREE.ImageUtils.loadTexture( sourceFiles, mapping, undefined, error );

				}
			}


			if ( repeat ) {

				texture.repeat.set( repeat[ 0 ], repeat[ 1 ] );

				if ( repeat[ 0 ] !== 1 ) texture.wrapS = THREE.RepeatWrapping;
				if ( repeat[ 1 ] !== 1 ) texture.wrapT = THREE.RepeatWrapping;

			}

			if ( offset ) {

				texture.offset.set( offset[ 0 ], offset[ 1 ] );

			}

			if ( wrap ) {

				var wrapMap = {
					'repeat': THREE.RepeatWrapping,
					'mirror': THREE.MirroredRepeatWrapping
				}

				if ( wrapMap[ wrap[ 0 ] ] !== undefined ) texture.wrapS = wrapMap[ wrap[ 0 ] ];
				if ( wrapMap[ wrap[ 1 ] ] !== undefined ) texture.wrapT = wrapMap[ wrap[ 1 ] ];

			}

			if ( anisotropy ) {

				texture.anisotropy = anisotropy;

			}
			if ( filter ) {

				texture.minFilter = filter[0];
				texture.magFilter = filter[2];

			}
			if ( format ) {

				texture.format = format;

			}
			if ( type ) {

				texture.type = type;

			}
			if ( name ) {

				texture.name = name;

			}

			if( attr instanceof Array){
				where[ attr[0] ] = texture;
			}else {
				where[ attr ] = texture;
			}

		}

		if ( json.materials !== undefined ) {
			 var materials = [];
			for ( var i = 0, l = json.materials.length; i < l; i ++ ) {

				 materials.push( this.parse( json.materials[ i ] ) );

			}
			return materials;

		}

		//search for textures
		var textures = {};
		var filesLoaded = [];
		var mapping,wrap,repeat,offset,anisotropy,filter,format, type, name;

		for( var attr in json){

			if ( attr === "envMap" || attr === "map" || attr === "lightMap" || attr === "bumpMap" || attr === "normalMap" || attr === "alphaMap" ) {

					sourceFile = json[attr];

					if(filesLoaded.indexOf(sourceFile) !== -1)
						continue;

					mapping = json[attr +"Mapping"];
					wrap = json[attr +"Wrap"];
					repeat = json[attr +"Repeat"];
					offset = json[attr +"Offset"];
					anisotropy = json[attr +"Anisotropy"];
					filter = json[attr +"Filter"];
					format = json[attr +"Format"];
					type = json[attr +"Typ"];
					name = json[attr +"Name"];

					loadTextures(textures, sourceFile, sourceFile, repeat, offset, wrap, anisotropy, mapping, filter, format, type, name );
					filesLoaded.push(sourceFile);
			}
		}

		if ( json.type !== undefined ) 		var material = new THREE[ json.type ];
		if ( json.name !== undefined ) material.name = json.name;
		if ( json.ambient !== undefined ) material.ambient.setHex( json.ambient );
		if ( json.color !== undefined ) material.color.setHex( json.color );
		if ( json.emissive !== undefined ) material.emissive.setHex( json.emissive );
		if ( json.specular !== undefined ) material.specular.setHex( json.specular );
		if ( json.shininess !== undefined ) material.shininess = json.shininess;
		if ( json.uniforms !== undefined ) material.uniforms = json.uniforms;
		if ( json.vertexShader !== undefined ) material.vertexShader = json.vertexShader;
		if ( json.fragmentShader !== undefined ) material.fragmentShader = json.fragmentShader;
		if ( json.vertexColors !== undefined ) material.vertexColors = json.vertexColors;
		if ( json.shading !== undefined ) material.shading =  THREE[json.shading];
		if ( json.blending !== undefined ) material.blending = json.blending;
		if ( json.side !== undefined ) material.side = json.side;
		if ( json.opacity !== undefined ) material.opacity = json.opacity;
		if ( json.transparent !== undefined ) material.transparent = json.transparent;
		if ( json.wireframe !== undefined ) material.wireframe = json.wireframe;
		if ( json.metal !== undefined ) material.metal = json.metal;
		if ( json.combine !== undefined ) material.combine =  THREE[json.combine];

		if ( json.map !== undefined && textures[json.map] !== undefined  ) material.map = textures[json.map] ;
		if ( json.lightMap !== undefined && textures[json.lightMap] !== undefined  ) material.lightMap = textures[json.lightMap] ;
		if ( json.envMap !== undefined && textures[json.envMap[0]] !== undefined  ) material.envMap = textures[json.envMap[0]] ;
		if ( json.bumpMap !== undefined && textures[json.bumpMap] !== undefined  ) material.bumpMap = textures[json.bumpMap]
		if ( json.normalMap !== undefined && textures[json.normalMap] !== undefined  )  material.normalMap = textures[json.normalMap] ;
		if ( json.specularMap !== undefined && textures[json.specularMap]  !== undefined )  material.specularMap = textures[json.specularMap] ;
		if ( json.alphaMap !== undefined && textures[json.alphaMap] !== undefined )  material.alphaMap = textures[json.alphaMap] ;

		if ( json.bumpScale ) {

			material.bumpScale = json.bumpScale;

		}

		if ( json.normalScale ) {

			material.normalScale = new THREE.Vector2( json.normalScale[0], json.normalScale[1] );

		}

	return material;
	}

};

