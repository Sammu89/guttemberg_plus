// Phase 2: Atomic Controls
export { ResetButton } from './ResetButton';
export { DeviceSwitcher } from './DeviceSwitcher';
export { UnitSelector } from './UnitSelector';
export { LinkToggle } from './LinkToggle';
export { IconButton } from './IconButton';
export { IconButtonGroup } from './IconButtonGroup';

// Phase 3: Composite Controls
export { ResponsiveWrapper, useResponsiveValue } from './ResponsiveWrapper';
export { BoxControl } from './BoxControl';
export { SliderWithInput } from './SliderWithInput';
export { ColorControl } from './ColorControl';
export { GradientControl } from './GradientControl';
export { BorderStyleControl, BorderStyleIcons } from './BorderStyleControl';
export { ShadowControl, SHADOW_PRESETS, ShadowIcons } from './ShadowControl';

// Phase 4: Typography Controls
export { AppearanceControl } from './AppearanceControl';
export { DecorationControl } from './DecorationControl';
export { LetterCaseControl } from './LetterCaseControl';
export { FontFamilyControl } from './FontFamilyControl';
export { AlignmentControl } from './AlignmentControl';
export { IconPositionControl } from './IconPositionControl';

// ============================================
// NEW LEGO CONTROLS (Compact, modular system)
// ============================================

// Lego Atoms
export { NumberInput } from './atoms/NumberInput';
export { UnitDropdown } from './atoms/UnitDropdown';
export { MiniSlider } from './atoms/MiniSlider';
export { LinkToggle as LegoLinkToggle } from './atoms/LinkToggle';
export { DeviceSwitcher as LegoDeviceSwitcher } from './atoms/DeviceSwitcher';
export { StyleIconButton } from './atoms/StyleIconButton';
export { ColorSwatch } from './atoms/ColorSwatch';
export { SideIcon, sideIcons } from './atoms/SideIcon';

// Lego Molecules
export { ValueWithUnit } from './molecules/ValueWithUnit';
export { SliderWithValue } from './molecules/SliderWithValue';

// Lego Organisms
export { CompactBoxRow } from './organisms/CompactBoxRow';

// Lego Full Controls
export { BorderPanel } from './full/BorderPanel';
export { BorderWidthControl } from './full/BorderWidthControl';
export { BorderRadiusControl } from './full/BorderRadiusControl';
export { SpacingControl } from './full/SpacingControl';
export { HeadingLevelControl } from './full/HeadingLevelControl';
