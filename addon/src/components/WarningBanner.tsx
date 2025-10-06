import React from "react";
import { styled } from "storybook/theming";
import { AlertIcon, CloseIcon } from "@storybook/icons";

interface WarningBannerProps {
  severity: "error" | "warning" | "info";
  message: string;
  details?: string;
  onDismiss?: () => void;
  dismissible?: boolean;
}

const BannerContainer = styled.div<{ severity: "error" | "warning" | "info" }>(
  ({ theme, severity }) => {
    const colors = {
      error: {
        background: `${theme.color.negative}15`,
        border: theme.color.negative,
        text: theme.color.negative,
      },
      warning: {
        background: `${theme.color.warning}15`,
        border: theme.color.warning,
        text: theme.color.warning,
      },
      info: {
        background: `${theme.color.secondary}15`,
        border: theme.color.secondary,
        text: theme.color.secondary,
      },
    };

    const palette = colors[severity];

    return {
      display: "flex",
      alignItems: "flex-start",
      gap: theme.layoutMargin / 2,
      padding: `${theme.layoutMargin / 2}px ${theme.layoutMargin}px`,
      background: palette.background,
      border: `1px solid ${palette.border}`,
      borderRadius: theme.appBorderRadius,
      color: palette.text,
      fontSize: 13,
    };
  },
);

const IconWrapper = styled.div({
  display: "flex",
  alignItems: "center",
  paddingTop: 2,
});

const Content = styled.div({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

const Message = styled.div({
  fontWeight: 600,
});

const Details = styled.div(({ theme }) => ({
  fontSize: 12,
  color: theme.color.mediumdark,
}));

const DismissButton = styled.button(({ theme }) => ({
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: 4,
  display: "flex",
  alignItems: "center",
  color: "inherit",
  opacity: 0.7,
  transition: "opacity 0.2s ease",
  "&:hover": {
    opacity: 1,
  },
}));

export const WarningBanner: React.FC<WarningBannerProps> = ({
  severity,
  message,
  details,
  onDismiss,
  dismissible = true,
}) => {
  return (
    <BannerContainer severity={severity}>
      <IconWrapper>
        <AlertIcon size={16} />
      </IconWrapper>
      <Content>
        <Message>{message}</Message>
        {details && <Details>{details}</Details>}
      </Content>
      {dismissible && onDismiss && (
        <DismissButton onClick={onDismiss} title="Dismiss">
          <CloseIcon size={14} />
        </DismissButton>
      )}
    </BannerContainer>
  );
};
