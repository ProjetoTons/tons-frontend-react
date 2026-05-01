import TopNavBar from "@/widgets/topnav-grafica/TopNavBar";
import EmployeeManagerWidget from "@/widgets/employee-manager/EmployeeManagerWidget";

export default function EmployeePage() {
  
  const handleNavClick = (page) => {
    console.log("Navegando para:", page);
  };

  return (
    <div className="bg-[#f3f3f3] min-h-screen flex flex-col font-sans">
      <TopNavBar onNavClick={handleNavClick} currentPage="funcionarios" />

      <main className="flex-1 px-8 sm:px-[64px] py-8 sm:py-[32px] flex flex-col gap-8">
        
        <EmployeeManagerWidget />
        
      </main>
    </div>
  );
}