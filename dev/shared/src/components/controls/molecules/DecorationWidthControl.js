/**
 * DecorationWidthControl - Slider + presets for text-decoration-thickness
 * Presets: auto, thin
 * Slider: 1-10px
 */
import { RangeControl, ButtonGroup, Button } from '@wordpress/components';

const PRESETS = ['auto', 'thin'];

export function DecorationWidthControl({ value = 'auto', onChange, disabled = false }) {
    const isPreset = PRESETS.includes(value);
    const numericValue = isPreset ? 2 : parseInt(value, 10) || 2;

    const handlePresetClick = (preset) => {
        onChange(preset);
    };

    const handleSliderChange = (num) => {
        onChange(`${num}px`);
    };

    return (
        <div className="gutplus-decoration-width-control">
            <div className="gutplus-decoration-width-control__presets">
                <ButtonGroup>
                    {PRESETS.map(preset => (
                        <Button
                            key={preset}
                            variant={value === preset ? 'primary' : 'secondary'}
                            onClick={() => handlePresetClick(preset)}
                            disabled={disabled}
                        >
                            {preset}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>

            <RangeControl
                label="Custom Width"
                value={numericValue}
                onChange={handleSliderChange}
                min={1}
                max={10}
                step={1}
                disabled={disabled}
                __nextHasNoMarginBottom
            />
        </div>
    );
}
