import { Outlet, useNavigate } from "react-router-dom";
import ChatList from "../components/chatList/ChatList";
import styled from "styled-components";

const DashboardStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  gap: 50px;
  padding-top: 20px;
  height: 100%;

  .menu {
    flex: 1;
  }

  .content {
    flex: 4;
    background-color: #12101b; /*color okna chat*/
  }
`;

const DashboardLayout = () => {
  const navigate = useNavigate();

  return (
    <DashboardStyled>
      <div className="menu">
        <ChatList />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </DashboardStyled>
  );
};

export default DashboardLayout;
