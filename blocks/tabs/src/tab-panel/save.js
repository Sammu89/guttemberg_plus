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
	const tabId = attributes.tabId || '';
	const blockProps = useBlockProps.save( {
		className: 'tab-panel',
		role: 'tabpanel',
		id: `panel-${ tabId }`,
		'aria-labelledby': `tab-${ tabId }`,
		'data-tab-id': tabId,
		'data-tab-title': attributes.title || '',
		'data-disabled': attributes.isDisabled ? 'true' : 'false',
		tabIndex: 0,
	} );

	return (
		<div { ...blockProps }>
			<div className="tab-panel-inner">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
