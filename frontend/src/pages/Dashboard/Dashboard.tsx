import "./Dashboard.css";
import { useEffect, useState } from "react";
import { Header } from "../../components/Сomponents";
import {
  Button,
  ModuleCard,
  SpinLoader,
  Text,
} from "../../components/Сomponents";
import { getDashboard } from "../../services/api/api";
import { setString } from "../../services/multilang/langselector";
import { logOut } from "../../services/helpers/helpers";

type userInfoProps = {
  name: string;
  email: string;
  isAdmin?: boolean;
};

const lang = localStorage.getItem("lang") || undefined;

function UserInfo({ name, email, isAdmin }: userInfoProps) {
  return (
    <div className="userMainInfo">
      <div className="userName">
        <Text preset="t3" as="h2" className="cardTitle">
          {name}
        </Text>
        <Text preset="t6" as="p" className="userLogin" fontStyle="italic">
          {email}
        </Text>
      </div>
      {isAdmin ? (
        <Text preset="t6" as="p" className="adminHint">
          {setString(lang, "dashboardAdminHint")}
          <a
            className="Text_view_link"
            href={
              "https://teacher.eduhund.com?accessToken=" +
              localStorage.getItem("accessToken")
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {setString(lang, "dashboardAdminLink")}
          </a>
        </Text>
      ) : (
        <Text preset="t6" as="p">
          {setString(lang, "dashboardHint1")}
          <a
            className="Text_view_link"
            href="https://t.me/eduhund_bot"
            target="_blank"
            rel="noopener noreferrer"
          >
            {setString(lang, "botName")}
          </a>
          {setString(lang, "dashboardHint2")}
          <a
            className="Text_view_link"
            href="mailto:edu@eduhund.ru"
            target="_blank"
            rel="noopener noreferrer"
          >
            {process.env.REACT_APP_EMAIL}
          </a>
          .
        </Text>
      )}
      <Button
        view="secondary"
        label={setString(lang, "logoutButton")}
        onClick={logOut}
      />
    </div>
  );
}

function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await getDashboard();
      setData(response.data);
    }
    fetchData();
  }, []);

  const activeModulesList = data?.modules.filter(
    (module: any) =>
      module?.status === "active" || module?.status === "deadline"
  );

  const uxModulesList = data?.modules.filter(
    (module: any) => module?.group?.groupId === "UX"
  );
  const otherModulesList = data?.modules.filter(
    (module: any) => module?.group?.groupId === undefined
  );

  const UxModules = (uxModulesList || []).map((module: any) => (
    <ModuleCard type="small" status={module?.status} data={module} />
  ));
  const OtherModules = (otherModulesList || []).map((module: any) => (
    <ModuleCard type="medium" status={module?.status} data={module} />
  ));

  const ActiveModules = (activeModulesList || []).map((module: any) => (
    <ModuleCard type="main" status={module?.status} data={module} />
  ));

  document.title = `eduHund & ${localStorage.getItem("name")}`;

  const DashboardContent = !data ? (
    <SpinLoader />
  ) : (
    <>
      <div className="mainContent">
        <div className="contentBlock dashboard">
          <div className="dashboardMainInfo">
            {activeModulesList && activeModulesList.length !== 0 ? (
              <div className="activeModules">{ActiveModules} </div>
            ) : (
              <div className="activeModules empty">
                <span>{setString(lang, "dashboardNoActiveModules")}</span>
              </div>
            )}
            <div className="userInfo">
              <UserInfo
                name={data?.username}
                email={data?.email}
                isAdmin={data?.isAdmin}
              />
            </div>
          </div>
          {UxModules && UxModules.length !== 0 && (
            <>
              <Text preset="t1" as="h2" className="modulesBlockHeader">
                {setString(lang, "dashboardSeriesUX")}
              </Text>
              <div className="modulesList">{UxModules}</div>
            </>
          )}
          {OtherModules && OtherModules.length > 1 && (
            <>
              <Text preset="t1" as="h2" className="modulesBlockHeader">
                {setString(lang, "dashboardOtherModules")}
              </Text>
              <div className="modulesList">{OtherModules}</div>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <Header type="main" />
      <div className="mainContainer">{DashboardContent}</div>
    </>
  );
}

export { Dashboard };
