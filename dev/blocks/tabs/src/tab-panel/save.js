/**
 * Tab Panel Block - Save Component
 *
 * Renders a single tab panel with its content.
 *
 * @package
 * @since 1.0.0
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	// Don't render disabled tabs on frontend
	if ( attributes.isDisabled ) {
		return null;
	}

	const tabId = attributes.tabId || '';
	const blockProps = useBlockProps.save( {
		className: 'tab-panel',
		role: 'tabpanel',
		id: `panel-${ tabId }`,
		'aria-labelledby': `tab-${ tabId }`,
		'data-tab-id': tabId,
		'data-tab-title': attributes.title || '',
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
