/**
 * FontWeightSlider - Slider for font-weight (100-900)
 * Shows when 'bold' is selected in FormattingToggleGroup
 */
import { RangeControl } from '@wordpress/components';

const HELP_TEXT =
	'Not every font supports every weight; the browser will use the closest available weight.';

export function FontWeightSlider( { value = 400, onChange, disabled = false } ) {
	return (
		<div className="gutplus-font-weight-slider">
			<RangeControl
				label="Font Weight"
				value={ value }
				onChange={ onChange }
				min={ 100 }
				max={ 900 }
				step={ 100 }
				marks={ [
					{ value: 100, label: '100' },
					{ value: 400, label: '400' },
					{ value: 700, label: '700' },
					{ value: 900, label: '900' },
				] }
				disabled={ disabled }
				help={ HELP_TEXT }
				__nextHasNoMarginBottom
			/>
		</div>
	);
}
