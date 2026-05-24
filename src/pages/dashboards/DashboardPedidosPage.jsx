import { useMemo } from 'react';

// Importações de componentes FSD
import StatsGrid from '@/widgets/kpi-grid/StatsGrid';
import FilterTabsFeature from '@/features/filter-tabs/ui/FilterTabsFeature';
import { StageAllocationChart } from '@/widgets/order-charts/StageAllocationChart';
import { EmployeePerformanceChart } from '@/widgets/order-charts/EmployeePerformanceChart';
import { DelayedOrdersList } from '@/widgets/delayed-orders-list/DelayedOrdersList';
import TopNavBar from '@/widgets/topnav-grafica/TopNavBar';
// import { ServiceStatusSidebar } from '@/widgets/service-status-sidebar';

export default function DashboardPedidosPage() {

    const handleNavClick = (page) => {
        console.log("Navegando para:", page);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] p-8 font-sans text-gray-800">

            <TopNavBar onNavClick={handleNavClick} currentPage="dashboard" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-9 flex flex-col gap-6">

                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl font-bold uppercase tracking-wide">
                            Visão Geral de Pedidos
                        </h1>
                        <FilterTabsFeature />
                    </div>

                    <StatsGrid />

                    <StageAllocationChart />


                    <div>
                        <EmployeePerformanceChart />
                        <DelayedOrdersList />
                    </div>

                </div>
            </div>
        </div>
    );
}
