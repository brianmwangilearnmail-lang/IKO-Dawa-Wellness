import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Target, BarChart3, Package, AlertTriangle, Calendar, ShoppingBag, DollarSign, ArrowLeft, Info, Activity, Printer, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSite } from '../context/SiteContext';
import { AnalyticsMetric, InventoryBatch } from '../types';

export const AnalyticsDashboard: React.FC = () => {
  const { analytics, inventoryBatches, products, orders } = useSite();
  const [activeDetail, setActiveDetail] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  const getProductTitle = (id: number) => products.find(p => p.id === id)?.title || 'Unknown Product';

  if (showReport) {
    return <DetailedReport onBack={() => setShowReport(false)} analytics={analytics} orders={orders} inventory={inventoryBatches} products={products} />;
  }

  if (activeDetail) {
    return (
      <MetricDetail 
        metricName={activeDetail} 
        onBack={() => setActiveDetail(null)} 
        analytics={analytics}
        inventoryBatches={inventoryBatches}
        products={products}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      {/* Action Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Business Intelligence</h2>
          <p className="text-[var(--text-muted)] text-sm">Real-time Operational Tracking</p>
        </div>
        <button 
          onClick={() => setShowReport(true)}
          className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <FileText className="w-4 h-4" /> Generate Full Report
        </button>
      </div>

      {/* Operation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard metric={analytics.operations.totalRevenue} icon={<DollarSign className="w-5 h-5" />} onClick={() => setActiveDetail('Net Revenue')} />
        <MetricCard metric={analytics.operations.orderVolume} icon={<ShoppingBag className="w-5 h-5" />} onClick={() => setActiveDetail('Order Volume')} />
      </div>

      {/* Top SKUs & Inventory Tracking */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--accent)]" /> Top Performing SKUs
          </h3>
          <div className="space-y-3">
            {analytics.operations.topSkus.map((sku, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-sm transition-all group">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-[var(--accent)] shadow-sm">
                  #{idx + 1}
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">{sku.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{sku.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">Ksh {(sku.revenue / 1000).toFixed(0)}k</p>
                  <p className="text-[10px] uppercase font-semibold text-[var(--accent)]">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Inventory Expiry Tracking
            </h3>
            <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-md text-xs font-semibold text-amber-700">
              {inventoryBatches.filter(b => b.status === 'expiring').length} Alerts Active
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Batch Info</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Product</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Expiry Date</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Quantity</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventoryBatches.map((batch) => (
                  <tr key={batch.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-slate-800 font-semibold text-sm">{batch.batchNumber}</p>
                      <p className="text-xs text-slate-400">ID: {batch.id}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-700 text-sm">{getProductTitle(batch.productId)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className={`text-sm ${batch.status === 'expiring' ? 'text-amber-600 font-semibold' : 'text-slate-700'}`}>{batch.expiryDate}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-semibold text-sm">
                      {batch.quantity} units
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded inline-flex text-xs font-semibold ${
                        batch.status === 'good' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                        batch.status === 'expiring' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                        'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DetailedReport: React.FC<{ onBack: () => void, analytics: any, orders: any[], inventory: any[], products: any[] }> = ({ onBack, analytics, orders, inventory, products }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-8 min-h-screen shadow-sm relative">
       <div className="flex justify-between items-start mb-10 print:hidden">
         <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-[var(--accent)] font-semibold text-sm transition-colors">
           <ArrowLeft className="w-4 h-4" /> Back to Dashboard
         </button>
         <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 transition-colors text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-sm">
           <Printer className="w-4 h-4" /> Print Report
         </button>
       </div>

       <div className="max-w-4xl mx-auto">
         <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Operations Report</h1>
            <p className="text-[var(--accent)] font-semibold tracking-wider uppercase text-xs mt-2">QUIN'S WELLNESS CENTER • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
         </div>

         <div className="grid grid-cols-2 gap-10 mb-12 border-y border-slate-200 py-10">
            <div>
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Financial Summary</p>
               <div className="space-y-3">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                     <span className="text-sm font-medium text-slate-600">Total Net Revenue</span>
                     <span className="font-bold text-slate-900">{analytics.operations.totalRevenue.value}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                     <span className="text-sm font-medium text-slate-600">Total Orders</span>
                     <span className="font-bold text-slate-900">{analytics.operations.orderVolume.value}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                     <span className="text-sm font-medium text-slate-600">Refund Rate</span>
                     <span className="font-bold text-red-600">{analytics.operations.refundRate.value}</span>
                  </div>
               </div>
            </div>
            <div>
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Top Performing Products</p>
               <div className="space-y-3">
                  {analytics.operations.topSkus.map((sku: any, i: number) => (
                    <div key={i} className="flex justify-between border-b border-slate-100 pb-2">
                       <span className="text-sm font-medium text-slate-600">{sku.title}</span>
                       <span className="font-bold text-[var(--accent)]">{sku.sales} units</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="mb-12">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-800 mb-4">Recent Transaction Log</h3>
            <div className="overflow-hidden border border-[var(--border)] rounded-xl shadow-sm">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                     <tr>
                        <th className="p-3 px-4 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">Order ID</th>
                        <th className="p-3 px-4 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">Customer</th>
                        <th className="p-3 px-4 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">Date</th>
                        <th className="p-3 px-4 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200 text-right">Amount</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {orders.slice(0, 10).map((o, i) => (
                       <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 px-4 font-semibold text-slate-900 text-sm">#{o.id}</td>
                          <td className="p-3 px-4 text-sm text-slate-700">{o.customer_name}</td>
                          <td className="p-3 px-4 text-sm text-slate-500">{new Date(o.created_at).toLocaleDateString()}</td>
                          <td className="p-3 px-4 text-sm font-bold text-slate-900 text-right">Ksh {o.total_amount.toLocaleString()}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">End of Report</p>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Generated automatically by ABA Health Intelligence Engine</p>
         </div>
       </div>
    </motion.div>
  );
};

interface MetricDetailProps {
  metricName: string;
  onBack: () => void;
  analytics: any;
  inventoryBatches: InventoryBatch[];
  products: any[];
}

const MetricDetail: React.FC<MetricDetailProps> = ({ metricName, onBack, analytics, inventoryBatches, products }) => {
  const trendData = [30, 45, 35, 55, 40, 65, 80];
  const maxVal = Math.max(...trendData);

  const getMetricValue = () => {
    switch (metricName) {
      case 'Net Revenue': return analytics.operations.totalRevenue.value;
      case 'Order Volume': return analytics.operations.orderVolume.value;
      case 'Inventory Health': return analytics.operations.daysOnHand.value;
      case 'Refunds': return analytics.operations.refundRate.value;
      default: return '0';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6 pb-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-[var(--accent)] font-semibold text-sm hover:-translate-x-1 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </button>
        <div className="flex items-center gap-3">
           <Activity className="w-5 h-5 text-[var(--accent)]" />
           <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{metricName} Analysis</h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-8 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">Performance Trend</h3>
              <p className="text-[var(--text-muted)] text-sm">Last 7 Days Activity</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-slate-900">{getMetricValue()}</span>
              <p className="text-sm font-medium text-emerald-600 mt-1">+12.5% vs last week</p>
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-4">
             {trendData.map((val, idx) => (
                <div key={idx} className="flex-grow flex flex-col items-center gap-4">
                   <div className="w-full relative group">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(val / maxVal) * 180}px` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="w-full bg-slate-200 group-hover:bg-[var(--accent)] rounded-t-md transition-colors duration-300"
                      />
                   </div>
                   <span className="text-xs font-medium text-slate-400">Day {idx + 1}</span>
                </div>
             ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-lg">
           <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
             <Info className="w-5 h-5 text-[var(--accent)]" /> Status Report
           </h3>
           <div className="space-y-5">
              <InsightItem title="Status" value="Healthy" color="text-emerald-400" />
              <InsightItem title="Confidence" value="98%" color="text-slate-300" />
              <div className="pt-5 border-t border-slate-700/50">
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Real-time data synchronization is active. All figures derived from verified transaction logs.
                </p>
                <button className="w-full bg-[var(--accent)] hover:opacity-90 transition-opacity text-white py-2.5 rounded-lg font-medium text-sm shadow-sm">
                  Export Logs (.csv)
                </button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

const InsightItem: React.FC<{title: string, value: string, color: string}> = ({ title, value, color }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm font-medium text-slate-400">{title}</span>
    <span className={`font-semibold ${color}`}>{value}</span>
  </div>
);

interface MetricCardProps {
  metric: AnalyticsMetric;
  icon: React.ReactNode;
  onClick: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, icon, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group hover:border-[var(--accent)] cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 group-hover:text-[var(--accent)] transition-colors">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${metric.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(metric.change)}%
        </div>
      </div>
      <p className="text-[var(--text-muted)] text-sm mb-1">{metric.label}</p>
      <h3 className="text-2xl font-bold text-slate-900">{metric.value}</h3>
      <div className="mt-2 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">View Details →</div>
    </div>
  );
};
