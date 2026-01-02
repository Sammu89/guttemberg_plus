/**
 * IconPicker Component
 *
 * Tab-based icon picker with three modes:
 * 1. Character - emoji/unicode input
 * 2. Image - WordPress Media Library
 * 3. Library - Dashicons + Lucide icons
 *
 * Output format: {kind: 'char'|'image'|'library', value: string}
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import { useState } from '@wordpress/element';
import {
	BaseControl,
	TabPanel,
	TextControl,
	Button,
	ButtonGroup,
	SearchControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Dashicon } from '@wordpress/components';
import * as LucideIcons from 'lucide-react';
import './IconPicker.scss';

/**
 * Dashicons available for selection
 * Common icons useful for accordions, tabs, and navigation
 */
const DASHICONS = [
	'arrow-down-alt2',
	'arrow-right-alt2',
	'arrow-up-alt2',
	'arrow-left-alt2',
	'arrow-down',
	'arrow-right',
	'arrow-up',
	'arrow-left',
	'plus',
	'plus-alt2',
	'minus',
	'no-alt',
	'menu',
	'menu-alt',
	'menu-alt2',
	'menu-alt3',
	'admin-collapse',
	'arrow-down-alt',
	'arrow-right-alt',
	'arrow-up-alt',
	'arrow-left-alt',
	'controls-play',
	'controls-pause',
	'controls-forward',
	'controls-back',
	'controls-skipforward',
	'controls-skipback',
	'star-filled',
	'star-empty',
	'flag',
	'info',
	'warning',
	'share',
	'check',
	'dismiss',
	'yes',
	'yes-alt',
	'no',
	'thumbs-up',
	'thumbs-down',
	'sort',
	'leftright',
	'randomize',
	'list-view',
	'grid-view',
	'tag',
	'category',
	'admin-page',
	'admin-post',
	'admin-links',
	'admin-appearance',
	'admin-plugins',
	'admin-users',
	'admin-tools',
	'admin-settings',
	'admin-network',
	'admin-home',
	'admin-generic',
	'admin-comments',
	'admin-media',
	'dashboard',
	'format-aside',
	'format-image',
	'format-gallery',
	'format-video',
	'format-audio',
	'format-quote',
	'format-chat',
	'welcome-write-blog',
	'welcome-add-page',
	'welcome-view-site',
	'welcome-widgets-menus',
	'welcome-comments',
	'welcome-learn-more',
	'image-crop',
	'image-rotate',
	'image-flip-vertical',
	'image-flip-horizontal',
	'image-filter',
	'undo',
	'redo',
	'editor-bold',
	'editor-italic',
	'editor-ul',
	'editor-ol',
	'editor-quote',
	'editor-alignleft',
	'editor-aligncenter',
	'editor-alignright',
	'editor-insertmore',
	'editor-spellcheck',
	'editor-expand',
	'editor-contract',
	'editor-kitchensink',
	'editor-underline',
	'editor-justify',
	'editor-textcolor',
	'editor-paste-word',
	'editor-paste-text',
	'editor-removeformatting',
	'editor-video',
	'editor-customchar',
	'editor-outdent',
	'editor-indent',
	'editor-help',
	'editor-strikethrough',
	'editor-unlink',
	'editor-rtl',
	'editor-break',
	'editor-code',
	'editor-paragraph',
	'editor-table',
];

/**
 * Get filtered Lucide icons (exclude utilities and components)
 */
const getLucideIcons = () => {
	const allKeys = Object.keys( LucideIcons );
	console.log( 'Total Lucide exports:', allKeys.length );

	const filtered = allKeys.filter(
		( name ) =>
			// Exclude utility functions and components
			! name.startsWith( 'create' ) &&
			name !== 'Icon' &&
			name !== 'default' &&
			name !== 'icons' &&
			// In lucide-react v0.562.0+, icons are objects, not functions
			// Check if it's a valid React component (object or function)
			( typeof LucideIcons[ name ] === 'object' || typeof LucideIcons[ name ] === 'function' ) &&
			// Icon components typically start with uppercase
			/^[A-Z]/.test( name ) &&
			// Exclude the *Icon duplicates (e.g., AArrowDownIcon when we have AArrowDown)
			! name.endsWith( 'Icon' )
	);

	console.log( 'Filtered Lucide icons:', filtered.length );
	console.log( 'Sample icons:', filtered.slice( 0, 10 ) );

	return filtered;
};

/**
 * Character Tab - Emoji/Unicode input
 */
function CharacterTab( { value, onChange } ) {
	const char = value?.kind === 'char' ? value.value : '';

	const handleChange = ( newChar ) => {
		onChange( { kind: 'char', value: newChar } );
	};

	// Common arrow and icon characters
	const commonChars = [ '▾', '▸', '►', '▼', '→', '↓', '★', '☰' ];

	return (
		<div className="icon-picker-character-tab">
			<TextControl
				label="Character or Emoji"
				value={ char }
				onChange={ handleChange }
				placeholder="Enter character (e.g., ▾, →, ★)"
				help="Enter any emoji, arrow, or unicode character"
			/>

			{ char && (
				<div className="character-preview">
					<span style={ { fontSize: '48px' } }>{ char }</span>
				</div>
			) }

			<div className="common-characters">
				<p>Common icons:</p>
				<ButtonGroup>
					{ commonChars.map( ( c ) => (
						<Button
							key={ c }
							onClick={ () => handleChange( c ) }
							variant={ char === c ? 'primary' : 'secondary' }
						>
							{ c }
						</Button>
					) ) }
				</ButtonGroup>
			</div>
		</div>
	);
}

/**
 * Image Tab - WordPress Media Library
 */
function ImageTab( { value, onChange } ) {
	const imageUrl = value?.kind === 'image' ? value.value : '';

	const handleSelect = ( media ) => {
		onChange( { kind: 'image', value: media.url } );
	};

	const handleRemove = () => {
		// Fallback to default character
		onChange( { kind: 'char', value: '▾' } );
	};

	return (
		<div className="icon-picker-image-tab">
			<MediaUploadCheck>
				<MediaUpload
					onSelect={ handleSelect }
					allowedTypes={ [ 'image' ] }
					value={ imageUrl }
					render={ ( { open } ) => (
						<>
							{ imageUrl ? (
								<div className="image-preview">
									<img
										src={ imageUrl }
										alt="Icon"
										style={ { maxWidth: '100px' } }
									/>
									<div className="image-actions">
										<Button onClick={ open } variant="secondary">
											Replace Image
										</Button>
										<Button
											onClick={ handleRemove }
											variant="tertiary"
											isDestructive
										>
											Remove
										</Button>
									</div>
								</div>
							) : (
								<Button onClick={ open } variant="primary">
									Upload Image
								</Button>
							) }
						</>
					) }
				/>
			</MediaUploadCheck>

			<p className="description">
				Recommended: SVG or PNG with transparent background, max 100x100px
			</p>
		</div>
	);
}

/**
 * Library Tab - Dashicons + Lucide icons
 */
function LibraryTab( { value, onChange } ) {
	const [ search, setSearch ] = useState( '' );
	const [ library, setLibrary ] = useState( 'dashicons' );

	const currentIcon = value?.kind === 'library' ? value.value : '';
	const LUCIDE_ICONS = getLucideIcons();

	const handleSelect = ( iconName ) => {
		onChange( {
			kind: 'library',
			value: `${ library }:${ iconName }`,
		} );
	};

	const filteredIcons =
		library === 'dashicons'
			? DASHICONS.filter( ( icon ) =>
					icon.toLowerCase().includes( search.toLowerCase() )
			  )
			: LUCIDE_ICONS.filter( ( icon ) =>
					icon.toLowerCase().includes( search.toLowerCase() )
			  );

	return (
		<div className="icon-picker-library-tab">
			<div className="library-selector">
				<ButtonGroup>
					<Button
						variant={ library === 'dashicons' ? 'primary' : 'secondary' }
						onClick={ () => setLibrary( 'dashicons' ) }
					>
						Dashicons (WP)
					</Button>
					<Button
						variant={ library === 'lucide' ? 'primary' : 'secondary' }
						onClick={ () => setLibrary( 'lucide' ) }
					>
						Lucide Icons
					</Button>
				</ButtonGroup>
			</div>

			<SearchControl
				value={ search }
				onChange={ setSearch }
				placeholder="Search icons..."
			/>

			<div className="icon-grid">
				{ filteredIcons.slice( 0, 200 ).map( ( iconName ) => {
					const isSelected = currentIcon === `${ library }:${ iconName }`;
					return (
						<button
							key={ iconName }
							className={ `icon-button ${ isSelected ? 'selected' : '' }` }
							onClick={ () => handleSelect( iconName ) }
							title={ iconName }
							type="button"
						>
							{ library === 'dashicons' ? (
								<Dashicon icon={ iconName } size={ 24 } />
							) : (
								<LucideIcon name={ iconName } size={ 24 } />
							) }
						</button>
					);
				} ) }
			</div>

			{ filteredIcons.length === 0 && (
				<p className="no-results">No icons found matching "{ search }"</p>
			) }
			{ filteredIcons.length > 200 && (
				<p className="results-limit">
					Showing first 200 of { filteredIcons.length } results. Try searching
					to narrow down.
				</p>
			) }
		</div>
	);
}

/**
 * Helper component to render Lucide icons
 */
function LucideIcon( { name, size = 24 } ) {
	const IconComponent = LucideIcons[ name ];

	if ( ! IconComponent ) {
		console.warn( `Lucide icon not found: ${ name }` );
		return null;
	}

	return <IconComponent size={ size } />;
}

/**
 * Main IconPicker Component
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the control
 * @param {Object} props.value - Current icon value {kind, value}
 * @param {Function} props.onChange - Callback when icon changes
 * @param {string} props.help - Help text
 * @returns {JSX.Element} IconPicker component
 */
export function IconPicker( { label, value, onChange, help } ) {
	// Determine initial tab based on current value
	const currentKind = value?.kind || 'char';
	const initialTab =
		currentKind === 'char' ? 'character' : currentKind === 'image' ? 'image' : 'library';

	const tabs = [
		{ name: 'character', title: 'Character', className: 'tab-character' },
		{ name: 'image', title: 'Image', className: 'tab-image' },
		{ name: 'library', title: 'Library', className: 'tab-library' },
	];

	return (
		<BaseControl label={ label } help={ help } className="icon-picker-control">
			<TabPanel tabs={ tabs } initialTabName={ initialTab }>
				{ ( tab ) => {
					switch ( tab.name ) {
						case 'character':
							return <CharacterTab value={ value } onChange={ onChange } />;
						case 'image':
							return <ImageTab value={ value } onChange={ onChange } />;
						case 'library':
							return <LibraryTab value={ value } onChange={ onChange } />;
						default:
							return null;
					}
				} }
			</TabPanel>

		</BaseControl>
	);
}

export default IconPicker;
