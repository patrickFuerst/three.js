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

		function create_texture( where, name, sourceFile, repeat, offset, wrap, anisotropy ) {


			function error(e){
				console.warn("Couldn't load texture")
			}

			var fullPath =  sourceFile;

			var texture;

			var loader = THREE.Loader.Handlers.get( fullPath );

			if ( loader !== null ) {

				texture = loader.load( fullPath );

			} else {

				texture = THREE.ImageUtils.loadTexture( fullPath , THREE.UVMapping , undefined, error );

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

			where[ name ] = texture;

		}

		if ( json.materials !== undefined ) {
			 var materials = [];
			for ( var i = 0, l = json.materials.length; i < l; i ++ ) {

				 materials.push( this.parse( json.materials[ i ] ) );

			}
			return materials;

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
		if ( json.shading !== undefined ) material.shading = json.shading;
		if ( json.blending !== undefined ) material.blending = json.blending;
		if ( json.side !== undefined ) material.side = json.side;
		if ( json.opacity !== undefined ) material.opacity = json.opacity;
		if ( json.transparent !== undefined ) material.transparent = json.transparent;
		if ( json.wireframe !== undefined ) material.wireframe = json.wireframe;
		if ( json.metal !== undefined ) material.metal = json.metal;

		// textures
		// this part is from Loader.js,  @author alteredq / http://alteredqualia.com/
		if ( json.map  ) {

			create_texture( material, 'map', json.map, json.mapRepeat, json.mapOffset, json.mapWrap, json.mapAnisotropy );

		}

		if ( json.lightMap  ) {

			create_texture( material, 'lightMap', json.lightMap, json.lightMapRepeat, json.lightMapOffset, json.lightMapWrap, json.lightMapAnisotropy );

		}

		if ( json.bumpMap  ) {
			create_texture( material, 'bumpMap', json.bumpMap, json.bumpMapRepeat, json.bumpMapOffset, json.bumpMapWrap, json.bumpMapAnisotropy );
		}

		if ( json.normalMap  ) {

			create_texture( material, 'normalMap', json.normalMap, json.normalMapRepeat, json.normalMapOffset, json.normalMapWrap, json.normalMapAnisotropy );

		}

		if ( json.specularMap  ) {

			create_texture( material, 'specularMap', json.specularMap, json.specularMapRepeat, json.specularMapOffset, json.specularMapWrap, json.specularMapAnisotropy );

		}

		if ( json.alphaMap ) {

			create_texture( material, 'alphaMap', json.alphaMap, json.alphaMapRepeat, json.alphaMapOffset, json.alphaMapWrap, json.alphaMapAnisotropy );

		}

		if ( json.bumpScale ) {

			material.bumpScale = json.bumpScale;

		}

		if ( json.normalScale ) {

			material.normalScale = new THREE.Vector2( json.normalScale[0], json.normalScale[1] );

		}


		return material;

	}

};

