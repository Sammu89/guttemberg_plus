/**
 * Tab Panel Block - Edit Component
 *
 * Individual tab panel that contains its own InnerBlocks content.
 *
 * @package
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

export default function Edit( { attributes, setAttributes, clientId } ) {
	// Get the parent block's active tab index
	const { parentClientId, tabIndex } = useSelect(
		( select ) => {
			const { getBlockParents, getBlocksByClientId, getBlockOrder } =
				select( 'core/block-editor' );
			const parents = getBlockParents( clientId );
			const parentId = parents[ parents.length - 1 ];

			// Get all tab-panel blocks under the parent
			const siblingBlocks = parentId ? getBlockOrder( parentId ) : [];
			const index = siblingBlocks.indexOf( clientId );

			return {
				parentClientId: parentId,
				tabIndex: index,
			};
		},
		[ clientId ]
	);

	// Check if this tab is active by comparing with parent's active tab
	const isActive = useSelect(
		( select ) => {
			if ( ! parentClientId ) {
				return false;
			}
			const parentBlock = select( 'core/block-editor' ).getBlock( parentClientId );
			return parentBlock?.attributes?.currentTab === tabIndex;
		},
		[ parentClientId, tabIndex ]
	);

	const blockProps = useBlockProps( {
		className: `tab-panel tab-panel-editor ${ isActive ? 'is-active' : '' }`,
		style: {
			display: isActive ? 'block' : 'none',
		},
	} );

	return (
		<div { ...blockProps }>
			<div className="tab-panel-content">
				<InnerBlocks
					templateLock={ false }
					placeholder={ __( 'Add tab content…', 'guttemberg-plus' ) }
				/>
			</div>
		</div>
	);
}
