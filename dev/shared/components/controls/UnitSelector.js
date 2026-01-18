import { ButtonGroup, Button } from '@wordpress/components';

export function UnitSelector( { value, onChange, units = [ 'px', 'em', 'rem' ] } ) {
	return (
		<ButtonGroup className="gutplus-unit-selector">
			{ units.map( ( unit ) => (
				<Button
					key={ unit }
					isPressed={ value === unit }
					onClick={ () => onChange( unit ) }
					isSmall
				>
					{ unit }
				</Button>
			) ) }
		</ButtonGroup>
	);
}
