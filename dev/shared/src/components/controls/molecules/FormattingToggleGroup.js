/**
 * FormattingToggleGroup - Multi-select toggle group for text formatting
 *
 * Options: None, Bold, Italic, Underline, Overline, Line-through
 * 'None' is exclusive - clears all others when clicked
 */
import { ButtonGroup } from '@wordpress/components';
import { ToggleChip } from '../atoms/ToggleChip';
import {
	formatBold,
	formatItalic,
	formatUnderline,
	formatStrikethrough,
	reset,
} from '@wordpress/icons';

const OverlineIcon = () => (
	<svg viewBox="0 0 24 24" width="24" height="24">
		<path d="M5 4h14v1.5H5V4zm3 6h8v10H8V10z" />
	</svg>
);

const OPTIONS = [
	{ key: 'none', icon: reset, label: 'None', exclusive: true },
	{ key: 'bold', icon: formatBold, label: 'Bold' },
	{ key: 'italic', icon: formatItalic, label: 'Italic' },
	{ key: 'underline', icon: formatUnderline, label: 'Underline' },
	{ key: 'overline', icon: OverlineIcon, label: 'Overline' },
	{ key: 'line-through', icon: formatStrikethrough, label: 'Strikethrough' },
];

export function FormattingToggleGroup( { value = [], onChange, disabled = false } ) {
	const handleToggle = ( key ) => {
		const option = OPTIONS.find( ( o ) => o.key === key );

		if ( option?.exclusive ) {
			onChange( [] );
			return;
		}

		if ( value.includes( key ) ) {
			onChange( value.filter( ( k ) => k !== key ) );
		} else {
			onChange( [ ...value, key ] );
		}
	};

	const isNoneActive = value.length === 0;

	return (
		<div className="gutplus-formatting-toggle-group">
			<ButtonGroup>
				{ OPTIONS.map( ( option ) => (
					<ToggleChip
						key={ option.key }
						icon={ option.icon }
						label={ option.label }
						isActive={ option.exclusive ? isNoneActive : value.includes( option.key ) }
						onClick={ () => handleToggle( option.key ) }
						disabled={ disabled }
					/>
				) ) }
			</ButtonGroup>
		</div>
	);
}
