import { Button } from '@wordpress/components';
import { reset } from '@wordpress/icons';

export function ResetButton({ onClick, disabled = false }) {
  return (
    <Button
      icon={reset}
      label="Reset to default"
      onClick={onClick}
      disabled={disabled}
      isSmall
      className="gutplus-reset-button"
    />
  );
}
