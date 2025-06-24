import React, { Suspense } from "react";
import { useDashboard } from "../../context/DashboardContext";
import OrganizationModule from "../../components/Layout/OrganizationModule";
import SurveyModule from "../../components/Layout/SurveyModule";
import OverviewModule from "../../components/Layout/OverviewModule";
import TemplateLibrary from "../../components/Layout/LibraryModule";

const Dashboard = () => {
  const { activeModule } = useDashboard();  // Fetch the active module from the context

  let module;  // Decide which module to render based on activeModule state
  switch (activeModule) {
    case 'organization':
      module = <OrganizationModule />;
      break;
    case 'surveys':
      module = <SurveyModule />;
      break;
    // case 'library':
    //   module = <TemplateLibrary />;
    //   break;
    default:
      module = <OverviewModule />;  // Default module (overview)
  }

  return (
    <div className="flex-1 p-6 ">
      <Suspense fallback={<div>Loading...</div>}>
        {module}  {/* Render the selected module */}
      </Suspense>
    </div>
  );
};

export default Dashboard;
