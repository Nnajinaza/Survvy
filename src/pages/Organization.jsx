import { useState, useEffect, useRef } from "react";
import OrgSideBar from "../components/Organization/OrgSideBar";
import StaffList from "../components/Organization/StaffList";
import SurveyList from "../components/Organization/SurveyList";
import api from "../api/api";
import { useParams } from "react-router-dom";
import CreateSurveyOrg from "../components/Organization/CreateOrgSurvey";
import ImportStaff from "../components/Organization/ImportStaff.jsx";
import { FaBars } from "react-icons/fa";

const OrganizationDetailPage = () => {
  const [selectedView, setSelectedView] = useState("staffs");
  const [organization, setOrganization] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // const [showShareModal, setShowShareModal] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const loadDetails = async () => {
      const org = await api.get(`/organizations/${id}`);
      setOrganization(org.data);
      setSurveys(org.data.surveys);
      setStaff(org.data.staffs);
    };
    loadDetails();
  }, [id]);


  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    }
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);


  const renderMainContent = () => {
    switch (selectedView) {
      case "staffs":
        return <StaffList staff={staff} onImportStaff={(newStaff) => setStaff([...staff, ...newStaff])} orgId={organization.id}/>;
      case "surveys":
        return <SurveyList surveys={surveys} orgName={organization.name} staffs={staff} />;
      case "create":
        return (
          <CreateSurveyOrg
            organizationId={id}
            onCreated={() => setSelectedView("surveys")}
          />
        );
      case "import":
        return (
          <ImportStaff
            organizationId={id}
            onCreated={() => setSelectedView("surveys")}
          />
        );
      // return <SurveyFormModal isOpen={true} onClose={() => setSelectedView("surveys")} organizationId={id} onCreated={() => setSelectedView("surveys")} />;
      // case "share":
      //   // return <ShareSurveyModal organizationId={id} />;
      //   <ShareSurveyModal
      //     isOpen={showShareModal}
      //     onClose={() => setShowShareModal(false)}
      //     survey={selectedSurvey}
      //     staffEmails={staff.map((s) => s.email)}
      //   />;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  if (!organization) return <div>Loading organization...</div>;

  return (
    <div className="flex h-screen relative">
      {/* Sidebar - large screen */}
      <div className="hidden md:flex md:w-64 bg-white border-r shadow z-10">
        <OrgSideBar
          selected={selectedView}
          onSelect={setSelectedView}
          orgName={organization.name}
        />
      </div>

      {/* Mobile Toggle Button */}
      <button
        className="absolute top-4 left-4 z-20 md:hidden text-gray-800"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FaBars className="text-2xl" />
      </button>

      {/* Sidebar - small screen drawer */}
      {isSidebarOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30" />
          {/* Sidebar Panel */}
          <div
            ref={sidebarRef}
            className="fixed top-0 left-0 h-full z-40 shadow-lg transition-transform duration-300 ease-in-out transform translate-x-0"
          >
            {/* <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#86BC24]">{organization.nameGGH}</h2>
              <FaTimes
                className="text-2xl text-gray-700 cursor-pointer"
                onClick={() => setIsSidebarOpen(false)}
              /> */}
            {/* </div> */}
            <OrgSideBar
              selected={selectedView}
              onSelect={(view) => {
                setSelectedView(view);
                setIsSidebarOpen(false); // auto-close on selection
              }}
              orgName={organization.name}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {renderMainContent()}
      </div>
    </div>
  );

  // return (
  //   <div className="flex h-screen">
  //     <OrgSideBar
  //       selected={selectedView}
  //       onSelect={setSelectedView}
  //       orgName={organization.name}
  //     />
  //     <div className="flex-1 p-6 overflow-y-auto">
  //       {/* <h1 className="text-2xl font-bold mb-4">{organization.name}</h1> */}
  //       {renderMainContent()}
  //     </div>
  //   </div>
  // );
};

export default OrganizationDetailPage;
