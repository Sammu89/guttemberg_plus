import { Button, ButtonGroup } from '@wordpress/components';
import { desktop, tablet, mobile } from '@wordpress/icons';
import { setGlobalResponsiveDevice } from '../../utils/responsive-device';

export function DeviceSwitcher({ value, onChange }) {
  const devices = [
    { name: 'desktop', icon: desktop, label: 'Desktop' },
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
            onChange(device.name);
            setGlobalResponsiveDevice(device.name);
          }}
          isSmall
        />
      ))}
    </ButtonGroup>
  );
}
