// Centralized Icons - import from here for consistency
export * from './icons';

// Phase 2: Atomic Controls
export { ResetButton } from './ResetButton';
export { UnitSelector } from './UnitSelector';
export { IconButton } from './IconButton';
export { IconButtonGroup } from './IconButtonGroup';

// Phase 3: Composite Controls
export { ResponsiveWrapper, useResponsiveValue } from './ResponsiveWrapper';
export { BoxControl } from './BoxControl';
export { SliderWithInput } from './SliderWithInput';
export { ColorControl } from './ColorControl';
export { ColorGradientControl } from './ColorGradientControl';
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

// Phase 5: Icon Components
export { IconPicker } from './IconPicker';
export { IconPanel } from './IconPanel';

// ============================================
// NEW LEGO CONTROLS (Compact, modular system)
// ============================================

// Lego Atoms
export { NumberInput } from './atoms/NumberInput';
export { UnitDropdown } from './atoms/UnitDropdown';
export { MiniSlider } from './atoms/MiniSlider';
export { LinkToggle as LegoLinkToggle } from './atoms/LinkToggle';
export { DeviceSwitcher as LegoDeviceSwitcher } from './atoms/DeviceSwitcher';
export { ResponsiveToggle } from './atoms/ResponsiveToggle';
export { StyleIconButton } from './atoms/StyleIconButton';
export { ColorSwatch } from './atoms/ColorSwatch';
export { SideIcon, sideIcons } from './atoms/SideIcon';
export { UtilityBar } from './UtilityBar';

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
export { ShadowPanel } from './full/ShadowPanel';
export { ShadowLayer } from './full/ShadowLayer';
