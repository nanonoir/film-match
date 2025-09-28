import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing(2)}px;
  background-color: ${({ theme }) => theme.colors.bgScreen};
`;

export const Header = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(3)}px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.h1}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

export const HeaderSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.small}px;
  color: ${({ theme }) => theme.colors.subtext};
`;

export const TokenWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(1)}px;
`;

export const TokenText = styled.Text`
  font-size: ${({ theme }) => theme.typography.body}px;
  font-weight: bold;
  margin-left: 4px;
  color: ${({ theme }) => theme.colors.text};
`;

export const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.h2}px;
  font-weight: bold;
  margin-top: ${({ theme }) => theme.spacing(2)}px;
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const RewardCard = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  padding: ${({ theme }) => theme.spacing(2)}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;

export const RewardTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.body}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

export const RewardDescription = styled.Text`
  font-size: ${({ theme }) => theme.typography.small}px;
  color: ${({ theme }) => theme.colors.subtext};
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;

export const RewardButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.border : theme.colors.primary};
  padding: ${({ theme }) => theme.spacing(1)}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  align-items: center;
`;

export const RewardButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryText};
  font-weight: bold;
`;

export const CodeBox = styled.View`
  background-color: ${({ theme }) => theme.colors.inputBg};
  padding: ${({ theme }) => theme.spacing(2)}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;

export const CodeText = styled.Text`
  font-family: monospace;
  font-size: ${({ theme }) => theme.typography.body}px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
`;
