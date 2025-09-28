import React, { useState } from "react";
import { FlatList } from "react-native";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { User } from '../../auth/domain/entities/User';
import {
  Container,
  Header,
  HeaderTitle,
  HeaderSubtitle,
  TokenWrapper,
  TokenText,
  RewardCard,
  RewardTitle,
  RewardDescription,
  RewardButton,
  RewardButtonText,
  CodeBox,
  CodeText,
  SectionTitle,
} from "./styles";



interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  available: boolean;
}

interface GeneratedCode {
  id: string;
  rewardId: string;
  code: string;
  title: string;
  used: boolean;
}

interface RewardsScreenProps {
  // Ahora, la prop 'user' puede ser User o null.
  // Esto hace que TypeScript te obligue a verificarla en el componente.
  user: User | null; 
  onUpdateUser: (user: User) => void;
}

const RewardsScreen: React.FC<RewardsScreenProps> = ({ user, onUpdateUser }) => {
  // --- MANEJO DE CASO 'USER ES NULL' ---
  if (!user) {
    // Puedes renderizar un spinner, un mensaje de error, o una pantalla vacía.
    return (
      <Container>
        <HeaderTitle>Cargando información de usuario...</HeaderTitle>
      </Container>
    );
  }
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([]);

  const rewards: Reward[] = [
    { id: "1", title: "Entrada gratis", description: "Un día de gym gratis", cost: 100, available: true },
    { id: "2", title: "Descuento suplementos", description: "20% off proteínas", cost: 50, available: true },
  ];

  const generateCode = async (reward: Reward) => {
    if (user.tokens < reward.cost) {
      Toast.show({ type: "error", text1: "No tenés suficientes tokens" });
      return;
    }

    const code = `GP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const newCode: GeneratedCode = {
      id: Date.now().toString(),
      rewardId: reward.id,
      code,
      title: reward.title,
      used: false,
    };

    setGeneratedCodes((prev) => [newCode, ...prev]);
    const updatedUser = { ...user, tokens: user.tokens - reward.cost };
    onUpdateUser(updatedUser);
    await AsyncStorage.setItem("gympoint_user", JSON.stringify(updatedUser));

    Toast.show({ type: "success", text1: `¡Código generado! ${code}` });
  };

  const copyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    Toast.show({ type: "success", text1: "Código copiado al portapapeles" });
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <HeaderTitle>Recompensas</HeaderTitle>
        <HeaderSubtitle>Canjeá tus tokens por beneficios</HeaderSubtitle>
        <TokenWrapper>
          <Ionicons name="logo-bitcoin" size={18} color="#facc15" />
          <TokenText>{user.tokens} tokens</TokenText>
        </TokenWrapper>
      </Header>

      {/* Rewards */}
      <SectionTitle>Disponibles</SectionTitle>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RewardCard>
            <RewardTitle>{item.title}</RewardTitle>
            <RewardDescription>{item.description}</RewardDescription>
            <RewardButton
              disabled={!item.available || user.tokens < item.cost}
              onPress={() => generateCode(item)}
            >
              <RewardButtonText>
                {user.tokens < item.cost ? `Faltan ${item.cost - user.tokens} tokens` : "Generar código"}
              </RewardButtonText>
            </RewardButton>
          </RewardCard>
        )}
      />

      {/* Generated Codes */}
      <SectionTitle>Mis Códigos</SectionTitle>
      <FlatList
        data={generatedCodes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CodeBox>
            <CodeText>{item.code}</CodeText>
            <RewardButton onPress={() => copyCode(item.code)}>
              <RewardButtonText>Copiar</RewardButtonText>
            </RewardButton>
          </CodeBox>
        )}
      />

      <Toast />
    </Container>
  );
};

export default RewardsScreen;
