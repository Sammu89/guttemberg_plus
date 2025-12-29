/**
 * FontWeightSlider - Slider for font-weight (100-900)
 * Shows when 'bold' is selected in FormattingToggleGroup
 */
import { RangeControl } from '@wordpress/components';

const WEIGHT_LABELS = {
    100: 'Thin',
    200: 'Extra Light',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'Semi Bold',
    700: 'Bold',
    800: 'Extra Bold',
    900: 'Black',
};

export function FontWeightSlider({ value = 400, onChange, disabled = false }) {
    return (
        <div className="gutplus-font-weight-slider">
            <RangeControl
                label="Font Weight"
                value={value}
                onChange={onChange}
                min={100}
                max={900}
                step={100}
                marks={[
                    { value: 100, label: '100' },
                    { value: 400, label: '400' },
                    { value: 700, label: '700' },
                    { value: 900, label: '900' },
                ]}
                disabled={disabled}
                help={WEIGHT_LABELS[value] || ''}
                __nextHasNoMarginBottom
            />
        </div>
    );
}
