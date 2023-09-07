"use client";
import Chessboard from "@/components/Chessboard";
import styled from "@emotion/styled";

const PageContainer = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

export default function Page() {
  return (
    <PageContainer>
      <Chessboard />
    </PageContainer>
  );
}
