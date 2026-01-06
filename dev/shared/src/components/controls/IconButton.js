import { Button } from '@wordpress/components';

export function IconButton( { icon, label, isSelected, onClick, disabled } ) {
	return (
		<Button
			className={ `gutplus-icon-button ${ isSelected ? 'is-selected' : '' }` }
			onClick={ onClick }
			disabled={ disabled }
			label={ label }
			showTooltip
		>
			{ icon }
		</Button>
	);
}
