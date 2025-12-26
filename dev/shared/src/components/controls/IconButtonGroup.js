import { BaseControl } from '@wordpress/components';
import { IconButton } from './IconButton';

export function IconButtonGroup({
  label,
  value,
  onChange,
  options,
  allowWrap = true
}) {
  return (
    <BaseControl label={label} className="gutplus-icon-button-group">
      <div className={`gutplus-button-row ${allowWrap ? 'wrap' : ''}`}>
        {options.map(option => (
          <IconButton
            key={option.value}
            icon={option.icon}
            label={option.label}
            isSelected={value === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </BaseControl>
  );
}
