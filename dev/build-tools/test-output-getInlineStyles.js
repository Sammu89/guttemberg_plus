  /**
   * Apply inline styles from effective values
   */
  const getInlineStyles = () => {
    const titleStyles = {};
    const contentStyles = {};
    const containerStyles = {};
    const iconStyles = {};

    // Styles for .accordion-header
    if (effectiveValues.titleColor !== undefined && effectiveValues.titleColor !== null) {
      titleStyles.color = effectiveValues.titleColor;
    }
    if (effectiveValues.titleBackgroundColor !== undefined && effectiveValues.titleBackgroundColor !== null) {
      titleStyles.backgroundColor = effectiveValues.titleBackgroundColor;
    }
    if (effectiveValues.hoverTitleColor !== undefined && effectiveValues.hoverTitleColor !== null) {
      titleStyles.color = effectiveValues.hoverTitleColor;
    }
    if (effectiveValues.hoverTitleBackgroundColor !== undefined && effectiveValues.hoverTitleBackgroundColor !== null) {
      titleStyles.backgroundColor = effectiveValues.hoverTitleBackgroundColor;
    }
    if (effectiveValues.titleFontSize !== undefined && effectiveValues.titleFontSize !== null) {
      titleStyles.fontSize = `${effectiveValues.titleFontSize}px`;
    }
    if (effectiveValues.titleFontWeight !== undefined && effectiveValues.titleFontWeight !== null) {
      titleStyles.fontWeight = effectiveValues.titleFontWeight;
    }
    if (effectiveValues.titleFontStyle !== undefined && effectiveValues.titleFontStyle !== null) {
      titleStyles.fontStyle = effectiveValues.titleFontStyle;
    }
    if (effectiveValues.titleTextTransform !== undefined && effectiveValues.titleTextTransform !== null) {
      titleStyles.textTransform = effectiveValues.titleTextTransform;
    }
    if (effectiveValues.titleTextDecoration !== undefined && effectiveValues.titleTextDecoration !== null) {
      titleStyles.textDecoration = effectiveValues.titleTextDecoration;
    }
    if (effectiveValues.titleAlignment !== undefined && effectiveValues.titleAlignment !== null) {
      titleStyles.textAlign = effectiveValues.titleAlignment;
    }

    // Styles for .accordion-content
    // Divider border (only if width > 0)
    if (effectiveValues.dividerWidth !== undefined && effectiveValues.dividerWidth > 0) {
      contentStyles.borderTop = `${effectiveValues.dividerWidth || 1}px ${effectiveValues.dividerStyle || 'solid'} ${effectiveValues.dividerColor || '#dddddd'}`;
    } else {
      contentStyles.borderTop = 'none';
    }
    if (effectiveValues.contentColor !== undefined && effectiveValues.contentColor !== null) {
      contentStyles.color = effectiveValues.contentColor;
    }
    if (effectiveValues.contentBackgroundColor !== undefined && effectiveValues.contentBackgroundColor !== null) {
      contentStyles.backgroundColor = effectiveValues.contentBackgroundColor;
    }
    if (effectiveValues.contentFontSize !== undefined && effectiveValues.contentFontSize !== null) {
      contentStyles.fontSize = `${effectiveValues.contentFontSize}px`;
    }

    // Styles for .wp-block-guttemberg-plus-accordion
    // border shorthand
    containerStyles.border = `${effectiveValues.borderWidth || 1}px ${effectiveValues.borderStyle || 'solid'} ${effectiveValues.borderColor || '#dddddd'}`;
    if (effectiveValues.borderRadius) {
      const br = effectiveValues.borderRadius;
      containerStyles.borderRadius = `${br.topLeft || 0}px ${br.topRight || 0}px ${br.bottomRight || 0}px ${br.bottomLeft || 0}px`;
    }
    if (effectiveValues.shadow !== undefined && effectiveValues.shadow !== null) {
      containerStyles.boxShadow = effectiveValues.shadow;
    }
    if (effectiveValues.shadowHover !== undefined && effectiveValues.shadowHover !== null) {
      containerStyles.boxShadow = effectiveValues.shadowHover;
    }

    // Styles for .accordion-icon
    if (effectiveValues.iconColor !== undefined && effectiveValues.iconColor !== null) {
      iconStyles.color = effectiveValues.iconColor;
    }
    if (effectiveValues.iconSize !== undefined && effectiveValues.iconSize !== null) {
      iconStyles.fontSize = `${effectiveValues.iconSize}px`;
    }

    return {
      title: titleStyles,
      content: contentStyles,
      container: containerStyles,
      icon: iconStyles,
    };
  };
