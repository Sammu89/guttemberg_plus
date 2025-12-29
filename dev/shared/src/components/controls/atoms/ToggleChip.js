/**
 * ToggleChip - Atomic toggle button for multi-select groups
 */
import { Button } from '@wordpress/components';

export function ToggleChip({ icon, label, isActive, onClick, disabled = false }) {
    return (
        <Button
            className={`gutplus-toggle-chip ${isActive ? 'is-active' : ''}`}
            onClick={onClick}
            disabled={disabled}
            aria-pressed={isActive}
            icon={icon}
            label={label}
            showTooltip
        />
    );
}
