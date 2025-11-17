/**
 * TOC Block - Edit Component
 *
 * Handles block rendering in the WordPress editor with:
 * - Automatic heading detection from post content
 * - Theme management integration
 * - Filter settings UI
 * - Live preview of TOC structure
 *
 * @package
 * @since 1.0.0
 */

/* global MutationObserver */

import { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	SelectControl,
	CheckboxControl,
	RangeControl,
} from '@wordpress/components';
import {
	getAllEffectiveValues,
	generateUniqueId,
	STORE_NAME,
	ThemeSelector,
	ColorPanel,
	TypographyPanel,
	BorderPanel,
	CustomizationWarning,
	debug,
} from '@shared';

/**
 * Edit Component
 * @param root0
 * @param root0.attributes
 * @param root0.setAttributes
 * @param root0.clientId
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	debug( '[DEBUG] TOC Edit mounted with attributes:', attributes );

	const { tocId, showTitle, titleText, currentTheme } = attributes;
	const [ headings, setHeadings ] = useState( [] );

	// Load themes from store
	const { themes, themesLoaded } = useSelect( ( select ) => {
		const { getThemes, areThemesLoaded } = select( STORE_NAME );
		return {
			themes: getThemes( 'toc' ) || {},
			themesLoaded: areThemesLoaded( 'toc' ),
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
		// Empty deps array is correct - STORE_NAME is constant and select() doesn't need deps
	}, [] );

	// Load themes on mount and get theme action dispatchers
	const { loadThemes, createTheme, updateTheme, deleteTheme, renameTheme } =
		useDispatch( STORE_NAME );
	useEffect( () => {
		if ( ! themesLoaded ) {
			loadThemes( 'toc' );
		}
	}, [ themesLoaded, loadThemes ] );

	// Generate unique ID on mount
	useEffect( () => {
		if ( ! tocId ) {
			setAttributes( { tocId: generateUniqueId() } );
		}
	}, [ tocId, setAttributes ] );

	// Detect headings in post content
	useEffect( () => {
		const detectHeadings = () => {
			// Get all headings in the post content (excluding this block)
			const contentArea = document.querySelector(
				'.editor-styles-wrapper'
			);
			if ( ! contentArea ) {
				return [];
			}

			const allHeadings =
				contentArea.querySelectorAll( 'h2, h3, h4, h5, h6' );
			const detectedHeadings = [];

			allHeadings.forEach( ( heading ) => {
				// Skip headings inside this TOC block
				const isInThisBlock = heading.closest(
					`[data-block="${ clientId }"]`
				);
				if ( isInThisBlock ) {
					return;
				}

				const level = parseInt( heading.tagName.charAt( 1 ), 10 );
				const text = heading.textContent.trim();
				const id = heading.id || '';
				const classes = Array.from( heading.classList );

				detectedHeadings.push( { level, text, id, classes } );
			} );

			return detectedHeadings;
		};

		// Run detection
		const detected = detectHeadings();
		setHeadings( detected );

		// Re-run on content changes (debounced)
		const observer = new MutationObserver( () => {
			setTimeout( () => {
				const updated = detectHeadings();
				setHeadings( updated );
			}, 100 );
		} );

		const contentArea = document.querySelector( '.editor-styles-wrapper' );
		if ( contentArea ) {
			observer.observe( contentArea, {
				childList: true,
				subtree: true,
				characterData: true,
			} );
		}

		return () => observer.disconnect();
	}, [ clientId ] );

	// Get CSS defaults
	const cssDefaults = window.tocDefaults || {};

	// Get effective values via cascade
	const theme = themes[ currentTheme ];
	debug( '[DEBUG] TOC theme:', theme );
	debug( '[DEBUG] TOC theme?.values:', theme?.values );

	const effectiveValues = getAllEffectiveValues(
		attributes,
		theme?.values,
		cssDefaults
	);

	debug( '[DEBUG] TOC Effective values:', effectiveValues );

	// Check if block has customizations
	const isCustomized = Object.keys( attributes ).some( ( key ) => {
		const value = attributes[ key ];
		const themeValue = theme?.values?.[ key ];
		return (
			value !== undefined &&
			value !== null &&
			value !== themeValue &&
			key !== 'tocId' &&
			key !== 'showTitle' &&
			key !== 'titleText' &&
			key !== 'currentTheme' &&
			key !== 'includeH2' &&
			key !== 'includeH3' &&
			key !== 'includeH4' &&
			key !== 'includeH5' &&
			key !== 'includeH6' &&
			key !== 'scrollBehavior' &&
			key !== 'scrollOffset'
		);
	} );

	/**
	 * Theme callback handlers
	 * @param themeName
	 */
	const handleSaveNewTheme = ( themeName ) => {
		createTheme( 'toc', themeName, effectiveValues );
		setAttributes( { currentTheme: themeName } );
	};

	const handleUpdateTheme = () => {
		updateTheme( 'toc', attributes.currentTheme, effectiveValues );
	};

	const handleDeleteTheme = () => {
		deleteTheme( 'toc', attributes.currentTheme );
		setAttributes( { currentTheme: '' } );
	};

	const handleRenameTheme = ( oldName, newName ) => {
		renameTheme( 'toc', oldName, newName );
		setAttributes( { currentTheme: newName } );
	};

	const handleResetCustomizations = () => {
		// Reset all customizable attributes to null
		const resetAttrs = {};
		Object.keys( attributes ).forEach( ( key ) => {
			if (
				key !== 'currentTheme' &&
				key !== 'tocId' &&
				key !== 'showTitle' &&
				key !== 'titleText' &&
				key !== 'includeH2' &&
				key !== 'includeH3' &&
				key !== 'includeH4' &&
				key !== 'includeH5' &&
				key !== 'includeH6' &&
				key !== 'scrollBehavior' &&
				key !== 'scrollOffset'
			) {
				resetAttrs[ key ] = null;
			}
		} );
		setAttributes( resetAttrs );
	};

	// Filter headings based on settings
	const filteredHeadings = filterHeadings( headings, attributes );

	// Block props
	const blockProps = useBlockProps( {
		className: 'wp-block-custom-toc',
		style: buildInlineStyles( effectiveValues ),
	} );

	return (
		<>
			<InspectorControls>
				{ /* Settings Panel */ }
				<PanelBody title="Settings" initialOpen={ true }>
					<ThemeSelector
						blockType="toc"
						currentTheme={ currentTheme }
						setAttributes={ setAttributes }
						attributes={ attributes }
						themes={ themes }
						themesLoaded={ themesLoaded }
						isCustomized={ isCustomized }
						effectiveValues={ effectiveValues }
						onSaveNew={ handleSaveNewTheme }
						onUpdate={ handleUpdateTheme }
						onDelete={ handleDeleteTheme }
						onRename={ handleRenameTheme }
						onReset={ handleResetCustomizations }
					/>

					<ToggleControl
						label="Show Title"
						checked={ showTitle }
						onChange={ ( value ) =>
							setAttributes( { showTitle: value } )
						}
					/>

					{ showTitle && (
						<TextControl
							label="Title Text"
							value={ titleText }
							onChange={ ( value ) =>
								setAttributes( { titleText: value } )
							}
						/>
					) }

					<ToggleControl
						label="Collapsible"
						checked={ attributes.isCollapsible }
						onChange={ ( value ) =>
							setAttributes( { isCollapsible: value } )
						}
					/>

					{ attributes.isCollapsible && (
						<>
							<ToggleControl
								label="Initially Collapsed"
								checked={ attributes.initiallyCollapsed }
								onChange={ ( value ) =>
									setAttributes( {
										initiallyCollapsed: value,
									} )
								}
							/>

							<SelectControl
								label="Click Behavior"
								value={ attributes.clickBehavior || 'navigate' }
								options={ [
									{
										label: 'Navigate to section',
										value: 'navigate',
									},
									{
										label: 'Navigate and collapse TOC',
										value: 'navigate-and-collapse',
									},
								] }
								onChange={ ( value ) =>
									setAttributes( { clickBehavior: value } )
								}
							/>
						</>
					) }
				</PanelBody>

				{ /* Heading Filter Panel */ }
				<PanelBody title="Heading Filter" initialOpen={ false }>
					<SelectControl
						label="Filter Mode"
						value={ attributes.filterMode }
						options={ [
							{
								label: 'Include All Headings',
								value: 'include-all',
							},
							{
								label: 'Include Only Selected',
								value: 'include-only',
							},
							{ label: 'Exclude Selected', value: 'exclude' },
						] }
						onChange={ ( value ) =>
							setAttributes( { filterMode: value } )
						}
					/>

					{ attributes.filterMode === 'include-only' && (
						<>
							<p>
								<strong>Include Levels:</strong>
							</p>
							{ [ 2, 3, 4, 5, 6 ].map( ( level ) => (
								<CheckboxControl
									key={ level }
									label={ `H${ level }` }
									checked={ attributes.includeLevels.includes(
										level
									) }
									onChange={ ( checked ) => {
										const levels = checked
											? [
													...attributes.includeLevels,
													level,
											  ]
											: attributes.includeLevels.filter(
													( l ) => l !== level
											  );
										setAttributes( {
											includeLevels: levels,
										} );
									} }
								/>
							) ) }

							<TextControl
								label="Include Classes (comma-separated)"
								value={ attributes.includeClasses }
								onChange={ ( value ) =>
									setAttributes( { includeClasses: value } )
								}
							/>
						</>
					) }

					{ attributes.filterMode === 'exclude' && (
						<>
							<p>
								<strong>Exclude Levels:</strong>
							</p>
							{ [ 2, 3, 4, 5, 6 ].map( ( level ) => (
								<CheckboxControl
									key={ level }
									label={ `H${ level }` }
									checked={ attributes.excludeLevels.includes(
										level
									) }
									onChange={ ( checked ) => {
										const levels = checked
											? [
													...attributes.excludeLevels,
													level,
											  ]
											: attributes.excludeLevels.filter(
													( l ) => l !== level
											  );
										setAttributes( {
											excludeLevels: levels,
										} );
									} }
								/>
							) ) }

							<TextControl
								label="Exclude Classes (comma-separated)"
								value={ attributes.excludeClasses }
								onChange={ ( value ) =>
									setAttributes( { excludeClasses: value } )
								}
							/>
						</>
					) }

					<RangeControl
						label="Depth Limit (0 = no limit)"
						value={ attributes.depthLimit || 0 }
						onChange={ ( value ) =>
							setAttributes( {
								depthLimit: value === 0 ? null : value,
							} )
						}
						min={ 0 }
						max={ 6 }
					/>
				</PanelBody>

				{ /* Numbering Panel */ }
				<PanelBody title="Numbering" initialOpen={ false }>
					<SelectControl
						label="Numbering Style"
						value={ attributes.numberingStyle }
						options={ [
							{ label: 'None', value: 'none' },
							{
								label: 'Decimal (1, 1.1, 1.1.1)',
								value: 'decimal',
							},
							{
								label: 'Decimal Leading Zero',
								value: 'decimal-leading-zero',
							},
							{ label: 'Roman Numerals', value: 'roman' },
							{ label: 'Letters (A, B, C)', value: 'letters' },
						] }
						onChange={ ( value ) =>
							setAttributes( { numberingStyle: value } )
						}
					/>
				</PanelBody>

				{ /* Typography Panel */ }
				<TypographyPanel
					effectiveValues={ effectiveValues }
					attributes={ attributes }
					setAttributes={ setAttributes }
					blockType="toc"
					theme={ theme }
					initialOpen={ false }
				/>

				{ /* Level 1 Typography Panel */ }
				<PanelBody
					title="Level 1 Typography (H2)"
					initialOpen={ false }
				>
					<SelectControl
						label="Font Style"
						value={ attributes.level1FontStyle || '' }
						options={ [
							{ label: 'Default', value: '' },
							{ label: 'Normal', value: 'normal' },
							{ label: 'Italic', value: 'italic' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								level1FontStyle: value || null,
							} )
						}
					/>

					<SelectControl
						label="Text Transform"
						value={ attributes.level1TextTransform || '' }
						options={ [
							{ label: 'Default', value: '' },
							{ label: 'None', value: 'none' },
							{ label: 'Uppercase', value: 'uppercase' },
							{ label: 'Lowercase', value: 'lowercase' },
							{ label: 'Capitalize', value: 'capitalize' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								level1TextTransform: value || null,
							} )
						}
					/>

					<SelectControl
						label="Text Decoration"
						value={ attributes.level1TextDecoration || '' }
						options={ [
							{ label: 'Default', value: '' },
							{ label: 'None', value: 'none' },
							{ label: 'Underline', value: 'underline' },
							{ label: 'Overline', value: 'overline' },
							{ label: 'Line Through', value: 'line-through' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								level1TextDecoration: value || null,
							} )
						}
					/>
				</PanelBody>

				{ /* Level 2 Typography Panel */ }
				<PanelBody
					title="Level 2 Typography (H3)"
					initialOpen={ false }
				>
					<SelectControl
						label="Font Style"
						value={ attributes.level2FontStyle || '' }
						options={ [
							{ label: 'Default', value: '' },
							{ label: 'Normal', value: 'normal' },
							{ label: 'Italic', value: 'italic' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								level2FontStyle: value || null,
							} )
						}
					/>

					<SelectControl
						label="Text Transform"
						value={ attributes.level2TextTransform || '' }
						options={ [
							{ label: 'Default', value: '' },
							{ label: 'None', value: 'none' },
							{ label: 'Uppercase', value: 'uppercase' },
							{ label: 'Lowercase', value: 'lowercase' },
							{ label: 'Capitalize', value: 'capitalize' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								level2TextTransform: value || null,
							} )
						}
					/>

					<SelectControl
						label="Text Decoration"
						value={ attributes.level2TextDecoration || '' }
						options={ [
							{ label: 'Default', value: '' },
							{ label: 'None', value: 'none' },
							{ label: 'Underline', value: 'underline' },
							{ label: 'Overline', value: 'overline' },
							{ label: 'Line Through', value: 'line-through' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								level2TextDecoration: value || null,
							} )
						}
					/>
				</PanelBody>

				{ /* Level 3+ Typography Panel */ }
				<PanelBody
					title="Level 3+ Typography (H4-H6)"
					initialOpen={ false }
				>
					<SelectControl
						label="Font Style"
						value={ attributes.level3PlusFontStyle || '' }
						options={ [
							{ label: 'Default', value: '' },
							{ label: 'Normal', value: 'normal' },
							{ label: 'Italic', value: 'italic' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								level3PlusFontStyle: value || null,
							} )
						}
					/>

					<SelectControl
						label="Text Transform"
						value={ attributes.level3PlusTextTransform || '' }
						options={ [
							{ label: 'Default', value: '' },
							{ label: 'None', value: 'none' },
							{ label: 'Uppercase', value: 'uppercase' },
							{ label: 'Lowercase', value: 'lowercase' },
							{ label: 'Capitalize', value: 'capitalize' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								level3PlusTextTransform: value || null,
							} )
						}
					/>

					<SelectControl
						label="Text Decoration"
						value={ attributes.level3PlusTextDecoration || '' }
						options={ [
							{ label: 'Default', value: '' },
							{ label: 'None', value: 'none' },
							{ label: 'Underline', value: 'underline' },
							{ label: 'Overline', value: 'overline' },
							{ label: 'Line Through', value: 'line-through' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								level3PlusTextDecoration: value || null,
							} )
						}
					/>
				</PanelBody>

				{ /* Color Panel */ }
				<ColorPanel
					effectiveValues={ effectiveValues }
					attributes={ attributes }
					setAttributes={ setAttributes }
					blockType="toc"
					theme={ theme }
					initialOpen={ false }
				/>

				{ /* Border Panel */ }
				<BorderPanel
					effectiveValues={ effectiveValues }
					attributes={ attributes }
					setAttributes={ setAttributes }
					blockType="toc"
					theme={ theme }
					initialOpen={ false }
				/>

				{ /* Customization Warning */ }
				{ isCustomized && (
					<CustomizationWarning
						currentTheme={ currentTheme }
						themes={ themes }
					/>
				) }
			</InspectorControls>

			<div { ...blockProps }>
				{ showTitle && (
					<div
						className="toc-title"
						style={ {
							fontSize: `${
								effectiveValues.titleFontSize || 20
							}px`,
							fontWeight:
								effectiveValues.titleFontWeight || '700',
							color: effectiveValues.titleColor || '#333333',
							textAlign: effectiveValues.titleAlignment || 'left',
						} }
					>
						{ titleText }
					</div>
				) }

				{ filteredHeadings.length === 0 ? (
					<p className="toc-empty-message">
						No headings found. Add H2-H6 headings to your content to
						populate the table of contents.
					</p>
				) : (
					<nav
						className="toc-list-wrapper"
						aria-label={ titleText || 'Table of Contents' }
					>
						{ renderHeadingsList(
							filteredHeadings,
							effectiveValues,
							attributes
						) }
					</nav>
				) }
			</div>
		</>
	);
}

/**
 * Filter headings based on filter settings
 * @param headings
 * @param attributes
 */
function filterHeadings( headings, attributes ) {
	const {
		filterMode,
		includeLevels,
		includeClasses,
		excludeLevels,
		excludeClasses,
		depthLimit,
	} = attributes;

	let filtered = headings;

	// Apply filter mode
	if ( filterMode === 'include-only' ) {
		filtered = filtered.filter( ( heading ) => {
			// Include if level matches
			if ( includeLevels.includes( heading.level ) ) {
				return true;
			}

			// Include if any class matches
			if ( includeClasses ) {
				const classes = includeClasses
					.split( ',' )
					.map( ( c ) => c.trim() );
				return classes.some( ( cls ) =>
					heading.classes.includes( cls )
				);
			}

			return false;
		} );
	} else if ( filterMode === 'exclude' ) {
		filtered = filtered.filter( ( heading ) => {
			// Exclude if level matches
			if ( excludeLevels.includes( heading.level ) ) {
				return false;
			}

			// Exclude if any class matches
			if ( excludeClasses ) {
				const classes = excludeClasses
					.split( ',' )
					.map( ( c ) => c.trim() );
				if (
					classes.some( ( cls ) => heading.classes.includes( cls ) )
				) {
					return false;
				}
			}

			return true;
		} );
	}

	// Apply depth limit
	if ( depthLimit && depthLimit > 0 ) {
		const minLevel = Math.min( ...filtered.map( ( h ) => h.level ) );
		filtered = filtered.filter(
			( heading ) => heading.level - minLevel < depthLimit
		);
	}

	return filtered;
}

/**
 * Render headings as nested list
 * @param headings
 * @param effectiveValues
 * @param attributes
 */
function renderHeadingsList( headings, effectiveValues, attributes ) {
	if ( headings.length === 0 ) {
		return null;
	}

	const listStyle =
		attributes.numberingStyle === 'none' ? {} : { listStyleType: 'none' };

	return (
		<ul
			className={ `toc-list numbering-${ attributes.numberingStyle }` }
			style={ listStyle }
		>
			{ headings.map( ( heading, index ) => {
				const levelClass = `toc-item-level-${ heading.level - 1 }`;
				const linkStyle = {
					color: effectiveValues.linkColor || '#0073aa',
					textDecoration: 'none',
				};

				return (
					<li key={ index } className={ `toc-item ${ levelClass }` }>
						<a
							href={ `#${ heading.id || `heading-${ index }` }` }
							className="toc-link"
							style={ linkStyle }
						>
							{ heading.text }
						</a>
					</li>
				);
			} ) }
		</ul>
	);
}

/**
 * Build inline CSS custom properties from effective values
 * @param effectiveValues
 */
function buildInlineStyles( effectiveValues ) {
	const styles = {};

	// Wrapper colors
	if ( effectiveValues.wrapperBackgroundColor ) {
		styles[ '--custom-wrapper-background-color' ] =
			effectiveValues.wrapperBackgroundColor;
	}
	if ( effectiveValues.wrapperBorderColor ) {
		styles[ '--custom-wrapper-border-color' ] =
			effectiveValues.wrapperBorderColor;
	}

	// Link colors
	if ( effectiveValues.linkColor ) {
		styles[ '--custom-link-color' ] = effectiveValues.linkColor;
	}
	if ( effectiveValues.linkHoverColor ) {
		styles[ '--custom-link-hover-color' ] = effectiveValues.linkHoverColor;
	}

	// Border
	if ( effectiveValues.wrapperBorderWidth ) {
		styles[
			'--custom-border-width'
		] = `${ effectiveValues.wrapperBorderWidth }px`;
	}
	if ( effectiveValues.wrapperBorderStyle ) {
		styles[ '--custom-border-style' ] = effectiveValues.wrapperBorderStyle;
	}
	if ( effectiveValues.wrapperBorderRadius ) {
		styles[
			'--custom-border-radius'
		] = `${ effectiveValues.wrapperBorderRadius }px`;
	}

	// Padding
	if ( effectiveValues.wrapperPadding ) {
		styles[
			'--custom-wrapper-padding'
		] = `${ effectiveValues.wrapperPadding }px`;
	}

	// Shadow
	if ( effectiveValues.wrapperShadow ) {
		styles[ '--custom-wrapper-shadow' ] = effectiveValues.wrapperShadow;
	}

	return styles;
}
