import styled from "styled-components";

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  border-radius: 12px;
  padding: 8px;
`;

export const HeaderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 12px;
  gap: 12px;
`;

export const HeaderTitle = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  color: white;
  font-size: 36px;
  font-weight: bold;
`;
export const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

export const HeaderButton = styled.button`
  width: 100%;
  height: 60px;
  border: 1px solid #604ae5;
  border-radius: 6px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

// VAULT
export const VaultContainer = styled.div`
  display: flex;
  align-items: flex-start;
  width: 70%;
  height: 100%;
  padding: 24px;
  gap: 12px;
`;
export const Vault = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  height: 50%;
  padding: 12px;
  gap: 12px;
`;

export const VaultTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  color: white;
  font-size: 36px;
  font-weight: bold;
`;

export const VaultItems = styled.div`
  display: flex;
  width: 100%;
  padding-top: 12px;
`;

// IMAGE CARD
export const ImageCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 240px;
  height: 480px;
  padding: 12px;
  gap: 12px;
`;

export const ImageBox = styled.img`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 240px;
  height: 480px;
  padding: 12px;
  gap: 12px;
`;

export const ImageButton = styled.button`
  width: 100%;
  height: 60px;
  border: 1px solid #604ae5;
  border-radius: 6px;
  background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;
