import styled from "styled-components";

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

export const CTAContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 360px;
  background-color: #21262a;
  border-radius: 12px;
  padding: 8px;
`;

export const CTAInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 12px;
  gap: 12px;
`;

export const MintInfosContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const MintInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export const MintInfoLeftContainer = styled.div`
  display: flex;
  gap: 14px;
`;

export const MintInfoTitle = styled.p`
  color: #bdbec0;
  font-size: 14px;
  margin: 0;
`;
export const MintInfoData = styled.p`
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  padding: 4px 0;
`;

export const InfoDataContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  background-color: #384457;
  font-size: 20px;
  color: white;
  border-radius: 6px;
  padding: 12px 48px;
`;

export const CTAButton = styled.button`
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
