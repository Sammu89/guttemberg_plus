import { Button } from '@wordpress/components';

const ResetIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path d="M21 12a9 9 0 1 1-3-6.7" />
		<path d="M21 3v6h-6" />
	</svg>
);

export function ResetButton( { onClick, disabled = false } ) {
	return (
		<Button
			icon={ <ResetIcon /> }
			label="Reset to default"
			onClick={ onClick }
			disabled={ disabled }
			isSmall
			className="gutplus-reset-button"
		/>
	);
}
