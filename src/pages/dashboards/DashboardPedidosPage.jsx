import { useState } from 'react';

// Importações de componentes FSD
import StatsGrid from '@/widgets/kpi-grid/StatsGrid';
import FilterTabsFeature from '@/features/filter-tabs/ui/FilterTabsFeature';
import { StageAllocationChart } from '@/widgets/order-charts/StageAllocationChart';
import { EmployeePerformanceChart } from '@/widgets/order-charts/EmployeePerformanceChart';
import PedidosListWidget from '@/widgets/pedidos-list/PedidosListWidget';
import { ServiceStatusModal } from '@/widgets/service-status-sidebar/ServiceStatusModal';
import TopNavBar from '@/widgets/topnav-grafica/TopNavBar';
import { EditMetas } from '@/widgets/edit-metas/EditMetas';

export default function DashboardPedidosPage() {
    const [showServiceStatus, setShowServiceStatus] = useState(false);
    
    // 1. Novo estado para controlar o modal de configuração de metas
    const [showMetasModal, setShowMetasModal] = useState(false);

    const handleNavClick = (page) => {
        console.log("Navegando para:", page);
    };

    return (
        <div className="h-screen flex flex-col bg-[#F5F5F0] font-sans text-gray-800 overflow-hidden">

            <TopNavBar onNavClick={handleNavClick} currentPage="dashboard" />

            <div className="flex-1 min-h-0 max-w-[1440px] w-full mx-auto px-4 lg:px-6 xl:px-10 py-2 lg:py-3 flex flex-col gap-2 lg:gap-3">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                        <h1 className="text-base lg:text-lg xl:text-xl font-bold uppercase tracking-wide text-gray-900 leading-tight">
                            Dashboard
                        </h1>
                        <p className="text-[11px] text-gray-500">
                            Acompanhe a produção e performance da operação
                        </p>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                        <FilterTabsFeature />
                        <button
                            onClick={() => setShowServiceStatus(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-[10px] font-bold uppercase tracking-wide text-gray-600"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Status
                        </button>
                    </div>
                </div>

                {/* KPIs */}
                {/* 2. Passando a função onEditGoal para o StatsGrid */}
                <StatsGrid onEditGoal={() => setShowMetasModal(true)} />

                {/* Gráficos + Atrasados */}
                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3">
                    <div className="lg:col-span-2 flex flex-col gap-2 lg:gap-3 min-h-0">
                        <section className="flex-1 min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm p-3 lg:p-4 flex flex-col">
                            <StageAllocationChart />
                        </section>
                        <section className="flex-1 min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm p-3 lg:p-4 flex flex-col">
                            <EmployeePerformanceChart />
                        </section>
                    </div>

                    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 lg:p-4 flex flex-col min-h-0">
                        <PedidosListWidget />
                    </section>
                </div>
            </div>

            {/* Modal Status dos Serviços */}
            {showServiceStatus && (
                <ServiceStatusModal onClose={() => setShowServiceStatus(false)} />
            )}

           {/* Modal para exibir metas */}
            {showMetasModal && (
                <EditMetas onClose={() => setShowMetasModal(false)} />
            )} 
           
        </div>
    );
}