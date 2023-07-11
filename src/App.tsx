import React from "react";
import useFreeLogin from "./client/use-free-login";
import MainContent from "./compents/mainContent";
import { Layout, Nav, Avatar, Dropdown } from "@douyinfe/semi-ui";

function App() {
  const { userInfo } = useFreeLogin();

  return (
    <Layout>
      <Layout.Header>
        <Nav mode="horizontal" defaultSelectedKeys={["Home"]}>
          <Nav.Footer>
            <Dropdown
              render={
                <Dropdown.Menu>
                  <Dropdown.Item>{userInfo.name}</Dropdown.Item>
                </Dropdown.Menu>
              }
            >
              <Avatar src={userInfo.avatar} size="small" />
            </Dropdown>
          </Nav.Footer>
        </Nav>
      </Layout.Header>
      <Layout.Content
        style={{
          padding: "10px 24px",
        }}
      >
        <MainContent />
      </Layout.Content>
    </Layout>
  );
}

export default App;
