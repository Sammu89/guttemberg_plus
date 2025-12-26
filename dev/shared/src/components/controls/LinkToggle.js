import { Button } from '@wordpress/components';
import { link, linkOff } from '@wordpress/icons';

export function LinkToggle({ linked, onChange }) {
  return (
    <Button
      icon={linked ? link : linkOff}
      label={linked ? 'Unlink sides' : 'Link sides'}
      onClick={() => onChange(!linked)}
      isPressed={linked}
      isSmall
      className="gutplus-link-toggle"
    />
  );
}
