/**
 * WordPress Data Store for Theme Management
 *
 * Manages theme CRUD operations via Redux store and REST API
 * Event-isolated storage per block type (accordion_themes, tabs_themes, toc_themes)
 *
 * @see docs/IMPLEMENTATION/24-WORDPRESS-INTEGRATION.md
 * @see docs/CORE-ARCHITECTURE/12-THEME-SYSTEM.md
 */

import { createReduxStore, register } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { debug } from '../utils/debug';

/**
 * Store name for theme management
 */
const STORE_NAME = 'gutenberg-blocks/themes';

/**
 * Initial state structure
 * Each block type has separate storage for event isolation
 */
const DEFAULT_STATE = {
	accordionThemes: {},
	tabsThemes: {},
	tocThemes: {},
	themesLoaded: {
		accordion: false,
		tabs: false,
		toc: false,
	},
	isLoading: false,
	error: null,
};

/**
 * Action types
 */
const TYPES = {
	SET_THEMES: 'SET_THEMES',
	SET_LOADING: 'SET_LOADING',
	SET_ERROR: 'SET_ERROR',
	THEME_CREATED: 'THEME_CREATED',
	THEME_UPDATED: 'THEME_UPDATED',
	THEME_DELETED: 'THEME_DELETED',
	THEME_RENAMED: 'THEME_RENAMED',
};

/**
 * Helper to get state key for block type
 *
 * @param {string} blockType - 'accordion', 'tabs', or 'toc'
 * @return {string} State key like 'accordionThemes'
 */
function getStateKey( blockType ) {
	return `${ blockType }Themes`;
}

/**
 * Reducer - Manages state changes
 *
 * @param {Object} state  - Current state
 * @param {Object} action - Action object
 * @return {Object} New state
 */
const reducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case TYPES.SET_THEMES: {
			const stateKey = getStateKey( action.blockType );
			return {
				...state,
				[ stateKey ]: action.themes,
				themesLoaded: {
					...state.themesLoaded,
					[ action.blockType ]: true,
				},
			};
		}

		case TYPES.SET_LOADING:
			return {
				...state,
				isLoading: action.isLoading,
			};

		case TYPES.SET_ERROR:
			return {
				...state,
				error: action.error,
			};

		case TYPES.THEME_CREATED: {
			const stateKey = getStateKey( action.blockType );
			debug( '[REDUCER DEBUG] THEME_CREATED reducer called' );
			debug( '[REDUCER DEBUG] Action:', action );
			debug( '[REDUCER DEBUG] State key:', stateKey );
			debug( '[REDUCER DEBUG] Previous state:', state );

			// Guard against undefined theme object
			if ( ! action.theme || ! action.theme.name ) {
				console.error( '[Theme Store] THEME_CREATED: Invalid theme object', action );
				return state;
			}

			const newState = {
				...state,
				[ stateKey ]: {
					...state[ stateKey ],
					[ action.theme.name ]: action.theme,
				},
			};
			debug( '[REDUCER DEBUG] New state after THEME_CREATED:', newState );
			return newState;
		}

		case TYPES.THEME_UPDATED: {
			const stateKey = getStateKey( action.blockType );
			// Guard against undefined theme object
			if ( ! action.theme || ! action.theme.name ) {
				console.error( '[Theme Store] THEME_UPDATED: Invalid theme object', action );
				return state;
			}
			return {
				...state,
				[ stateKey ]: {
					...state[ stateKey ],
					[ action.theme.name ]: action.theme,
				},
			};
		}

		case TYPES.THEME_DELETED: {
			const stateKey = getStateKey( action.blockType );
			const newThemes = { ...state[ stateKey ] };
			delete newThemes[ action.themeName ];
			return {
				...state,
				[ stateKey ]: newThemes,
			};
		}

		case TYPES.THEME_RENAMED: {
			const stateKey = getStateKey( action.blockType );
			const newThemes = { ...state[ stateKey ] };
			const theme = newThemes[ action.oldName ];
			delete newThemes[ action.oldName ];
			newThemes[ action.newName ] = {
				...theme,
				name: action.newName,
			};
			return {
				...state,
				[ stateKey ]: newThemes,
			};
		}

		default:
			return state;
	}
};

/**
 * Actions - Trigger state changes and API calls
 */
const actions = {
	/**
	 * Load all themes for a block type
	 *
	 * @param {string} blockType - 'accordion', 'tabs', or 'toc'
	 */
	*loadThemes( blockType ) {
		yield actions.setLoading( true );
		yield actions.setError( null );

		try {
			const themes = yield {
				type: 'API_FETCH',
				request: {
					path: `/gutenberg-blocks/v1/themes/${ blockType }`,
					method: 'GET',
				},
			};

			return {
				type: TYPES.SET_THEMES,
				blockType,
				themes,
			};
		} catch ( error ) {
			yield actions.setError( error.message );
			return { type: 'LOAD_THEMES_ERROR' };
		} finally {
			yield actions.setLoading( false );
		}
	},

	/**
	 * Create a new theme
	 *
	 * @param {string} blockType - Block type
	 * @param {string} name      - Theme name (must be unique)
	 * @param {Object} values    - Complete snapshot of all attribute values
	 */
	*createTheme( blockType, name, values ) {
		debug( '[REDUX DEBUG] createTheme action called:', { blockType, name, values } );
		yield actions.setLoading( true );
		yield actions.setError( null );

		try {
			const theme = yield {
				type: 'API_FETCH',
				request: {
					path: '/gutenberg-blocks/v1/themes',
					method: 'POST',
					data: {
						blockType,
						name,
						values,
					},
				},
			};

			debug( '[REDUX DEBUG] API returned theme:', theme );

			const action = {
				type: TYPES.THEME_CREATED,
				blockType,
				theme,
			};
			debug( '[REDUX DEBUG] Dispatching THEME_CREATED action:', action );

			return action;
		} catch ( error ) {
			console.error( '[REDUX DEBUG] createTheme error:', error );
			yield actions.setError( error.message );
			throw error;
		} finally {
			yield actions.setLoading( false );
		}
	},

	/**
	 * Update an existing theme
	 *
	 * @param {string} blockType - Block type
	 * @param {string} name      - Theme name
	 * @param {Object} values    - New complete snapshot
	 */
	*updateTheme( blockType, name, values ) {
		yield actions.setLoading( true );
		yield actions.setError( null );

		try {
			const theme = yield {
				type: 'API_FETCH',
				request: {
					path: `/gutenberg-blocks/v1/themes/${ blockType }/${ encodeURIComponent(
						name
					) }`,
					method: 'PUT',
					data: {
						values,
					},
				},
			};

			return {
				type: TYPES.THEME_UPDATED,
				blockType,
				theme,
			};
		} catch ( error ) {
			yield actions.setError( error.message );
			throw error;
		} finally {
			yield actions.setLoading( false );
		}
	},

	/**
	 * Delete a theme
	 *
	 * @param {string} blockType - Block type
	 * @param {string} name      - Theme name
	 */
	*deleteTheme( blockType, name ) {
		yield actions.setLoading( true );
		yield actions.setError( null );

		try {
			yield {
				type: 'API_FETCH',
				request: {
					path: `/gutenberg-blocks/v1/themes/${ blockType }/${ encodeURIComponent(
						name
					) }`,
					method: 'DELETE',
				},
			};

			return {
				type: TYPES.THEME_DELETED,
				blockType,
				themeName: name,
			};
		} catch ( error ) {
			yield actions.setError( error.message );
			throw error;
		} finally {
			yield actions.setLoading( false );
		}
	},

	/**
	 * Rename a theme
	 *
	 * @param {string} blockType - Block type
	 * @param {string} oldName   - Current theme name
	 * @param {string} newName   - New theme name
	 */
	*renameTheme( blockType, oldName, newName ) {
		yield actions.setLoading( true );
		yield actions.setError( null );

		try {
			yield {
				type: 'API_FETCH',
				request: {
					path: `/gutenberg-blocks/v1/themes/${ blockType }/${ encodeURIComponent(
						oldName
					) }/rename`,
					method: 'POST',
					data: {
						newName,
					},
				},
			};

			return {
				type: TYPES.THEME_RENAMED,
				blockType,
				oldName,
				newName,
			};
		} catch ( error ) {
			yield actions.setError( error.message );
			throw error;
		} finally {
			yield actions.setLoading( false );
		}
	},

	/**
	 * Set loading state
	 *
	 * @param {boolean} isLoading - Loading state
	 */
	setLoading( isLoading ) {
		return {
			type: TYPES.SET_LOADING,
			isLoading,
		};
	},

	/**
	 * Set error message
	 *
	 * @param {string|null} error - Error message
	 */
	setError( error ) {
		return {
			type: TYPES.SET_ERROR,
			error,
		};
	},
};

/**
 * Selectors - Query state
 */
const selectors = {
	/**
	 * Get all themes for a block type
	 *
	 * @param {Object} state     - Store state
	 * @param {string} blockType - Block type
	 * @return {Object} Themes object { themeName: themeData }
	 */
	getThemes( state, blockType ) {
		const stateKey = getStateKey( blockType );
		return state[ stateKey ] || {};
	},

	/**
	 * Get a specific theme
	 *
	 * @param {Object} state     - Store state
	 * @param {string} blockType - Block type
	 * @param {string} themeName - Theme name
	 * @return {Object|null} Theme object or null if not found
	 */
	getTheme( state, blockType, themeName ) {
		const themes = selectors.getThemes( state, blockType );
		return themes[ themeName ] || null;
	},

	/**
	 * Check if a theme exists
	 *
	 * @param {Object} state     - Store state
	 * @param {string} blockType - Block type
	 * @param {string} themeName - Theme name
	 * @return {boolean} True if theme exists
	 */
	hasTheme( state, blockType, themeName ) {
		return selectors.getTheme( state, blockType, themeName ) !== null;
	},

	/**
	 * Get loading state
	 *
	 * @param {Object} state - Store state
	 * @return {boolean} True if loading
	 */
	isLoading( state ) {
		return state.isLoading;
	},

	/**
	 * Get error message
	 *
	 * @param {Object} state - Store state
	 * @return {string|null} Error message or null
	 */
	getError( state ) {
		return state.error;
	},

	/**
	 * Check if themes have been loaded for a specific block type
	 *
	 * @param {Object} state     - Store state
	 * @param {string} blockType - Block type
	 * @return {boolean} True if themes have been loaded
	 */
	areThemesLoaded( state, blockType ) {
		return state.themesLoaded?.[ blockType ] || false;
	},

	/**
	 * Get array of theme names for a block type
	 *
	 * @param {Object} state     - Store state
	 * @param {string} blockType - Block type
	 * @return {string[]} Array of theme names
	 */
	getThemeNames( state, blockType ) {
		const themes = selectors.getThemes( state, blockType );
		return Object.keys( themes );
	},
};

/**
 * Controls - Handle side effects (API calls)
 */
const controls = {
	API_FETCH( { request } ) {
		return apiFetch( request );
	},
};

/**
 * Create and register the store
 */
const store = createReduxStore( STORE_NAME, {
	reducer,
	actions,
	selectors,
	controls,
} );

/**
 * Register the store with WordPress data registry.
 *
 * Note: This registration code runs in each block's bundle since webpack
 * includes the shared module in each build. The first block to load will
 * successfully register the store. Subsequent blocks will get an "already
 * registered" error which is expected and safely ignored.
 *
 * Any other error indicates a real problem (e.g., malformed store configuration)
 * and will be logged and re-thrown for debugging.
 */
try {
	register( store );
} catch ( error ) {
	// Only silently ignore "already registered" errors
	if ( error.message && error.message.includes( 'already registered' ) ) {
		// Expected when multiple blocks load - safe to ignore
	} else {
		// Log and re-throw other errors - they indicate real problems
		console.error( '[Theme Store] Unexpected registration error:', error );
		throw error;
	}
}

export default store;
export { STORE_NAME };
