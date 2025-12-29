import { Button, ButtonGroup } from '@wordpress/components';
import { desktop, tablet, mobile } from '@wordpress/icons';
import { setGlobalResponsiveDevice } from '../../utils/responsive-device';

export function DeviceSwitcher({ value, onChange }) {
  const devices = [
    { name: 'global', icon: desktop, label: 'Global' },
    { name: 'tablet', icon: tablet, label: 'Tablet' },
    { name: 'mobile', icon: mobile, label: 'Mobile' },
  ];

  return (
    <ButtonGroup className="gutplus-device-switcher">
      {devices.map(device => (
        <Button
          key={device.name}
          icon={device.icon}
          label={device.label}
          isPressed={value === device.name}
          onClick={() => {
            setGlobalResponsiveDevice(device.name);
            onChange?.(device.name);
          }}
          isSmall
        />
      ))}
    </ButtonGroup>
  );
}
