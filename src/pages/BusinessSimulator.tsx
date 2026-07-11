import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  Sliders, RefreshCw, AlertTriangle, Info, TrendingUp, 
  ChefHat, Bike, ShieldAlert, Award, Zap, LayoutDashboard,
  ShoppingCart, Activity, Clock, ShoppingBag, Trash2
} from 'lucide-react';

export const BusinessSimulator: React.FC = () => {
  const { state: contextState, updateState, resetSimulation } = useRestaurant();

  // 1. Local Interactive States initialized from context state
  const [chefCount, setChefCount] = useState(contextState?.chefCount || 3);
  const [riderCount, setRiderCount] = useState(contextState?.riderCount || 2);
  const [cheeseStock, setCheeseStock] = useState(contextState?.cheeseStockRatio || 0.4);
  const [avocadoStock, setAvocadoStock] = useState(contextState?.avocadoStockRatio || 1.5);
  const [marketingScale, setMarketingScale] = useState(contextState?.marketingSpendMultiplier || 1.2);

  // Sync state if context changes externally
  useEffect(() => {
    if (contextState) {
      setChefCount(contextState.chefCount || 3);
      setRiderCount(contextState.riderCount || 2);
      setCheeseStock(contextState.cheeseStockRatio || 0.4);
      setAvocadoStock(contextState.avocadoStockRatio || 1.5);
      setMarketingScale(contextState.marketingSpendMultiplier || 1.2);
    }
  }, [contextState]);

  // 2. Real-Time Math Formulation Engine
  const baseRevenue = 144000;
  const baseWaste = 6580;
  const basePrepSeconds = 1176; 
  const baseDeliveryMins = 32;

  const incomingOrders = Math.round(118 * marketingScale);
  const kitchenLoad = Math.min(100, Math.round((incomingOrders / (chefCount * 30)) * 100));
  const revenueTotal = Math.round(baseRevenue * marketingScale * (cheeseStock < 0.6 ? 0.93 : 1)); 
  const wasteCost = Math.round(baseWaste * (avocadoStock > 1.2 ? (avocadoStock * 1.8) : avocadoStock));
  
  const stockDelayModifier = cheeseStock < 0.6 ? (0.6 - cheeseStock) * 400 : 0;
  const averagePrepTimeSeconds = Math.round((basePrepSeconds * (4 / chefCount)) + stockDelayModifier);
  const prepMinutes = Math.floor(averagePrepTimeSeconds / 60);
  const prepSeconds = averagePrepTimeSeconds % 60;

  const deliveryTransitSLA = Math.round(baseDeliveryMins * (incomingOrders / (riderCount * 22)));

  const scoreDeductions = 
    (kitchenLoad > 90 ? 10 : 0) + 
    (deliveryTransitSLA > 45 ? 15 : 0) + 
    (cheeseStock < 0.6 ? 10 : 0) + 
    (avocadoStock > 1.4 ? 8 : 0);
  const operationalScore = Math.max(0, Math.min(100, 95 - scoreDeductions));

  const scoreColor = operationalScore > 80 ? '#22c55e' : operationalScore > 65 ? '#06b6d4' : '#ef4444';
  const scoreText = operationalScore > 80 ? 'Excellent' : operationalScore > 65 ? 'Good' : 'Critical';

  const simulatedAlerts = [];
  if (cheeseStock < 0.6) {
    simulatedAlerts.push({
      id: 'cheese-alert',
      title: 'Cheese Stock Depletion',
      desc: `Cheese stock at ${Math.round(cheeseStock * 35)}kg — ${Math.round((0.6 - cheeseStock) * 100)}% below safety minimum.`,
      severity: 'critical'
    });
  }
  if (deliveryTransitSLA > 40) {
    simulatedAlerts.push({
      id: 'rider-alert',
      title: 'Delivery Delay Spike',
      desc: `Transit time predicted to exceed standard SLAs by ${deliveryTransitSLA - baseDeliveryMins} mins.`,
      severity: 'critical'
    });
  }
  if (avocadoStock > 1.2) {
    simulatedAlerts.push({
      id: 'avocado-alert',
      title: 'High Avocado Spoilage Alert',
      desc: `Avocado inventory at ${Math.round(avocadoStock * 100)}% target. High risk of immediate wastage.`,
      severity: 'warning'
    });
  }
  if (kitchenLoad > 90) {
    simulatedAlerts.push({
      id: 'load-alert',
      title: 'Kitchen Station Bottleneck',
      desc: `Current station load at ${kitchenLoad}%. Additional line chefs recommended.`,
      severity: 'warning'
    });
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSliderChange = (key: string, value: number) => {
    if (key === 'chefCount') { setChefCount(value); updateState({ chefCount: value }); }
    if (key === 'riderCount') { setRiderCount(value); updateState({ riderCount: value }); }
    if (key === 'cheeseStockRatio') { setCheeseStock(value); updateState({ cheeseStockRatio: value }); }
    if (key === 'avocadoStockRatio') { setAvocadoStock(value); updateState({ avocadoStockRatio: value }); }
    if (key === 'marketingSpendMultiplier') { setMarketingScale(value); updateState({ marketingSpendMultiplier: value }); }
  };

  const handleReset = () => {
    resetSimulation();
    setChefCount(3);
    setRiderCount(2);
    setCheeseStock(0.4);
    setAvocadoStock(1.5);
    setMarketingScale(1.2);
  };

  const applyOptimizationTip = () => {
    handleSliderChange('riderCount', 3);
    handleSliderChange('marketingSpendMultiplier', 1.0);
  };

  return (
    <div style={{ 
      backgroundColor: '#000000', 
      color: '#a1a1aa', 
      minHeight: '100vh', 
      maxHeight: '100vh',
      overflowY: 'auto', 
      padding: '24px', 
      fontFamily: 'system-ui, sans-serif' 
    }}>
      
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LayoutDashboard size={20} style={{ color: '#06b6d4' }} />
            Operational Simulator
          </h2>
          <p style={{ fontSize: '12px', color: '#71717a', margin: '4px 0 0 0' }}>Simulate real-time changes, predict downstream operational impacts, and optimize pipeline efficiency.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#a1a1aa', cursor: 'pointer', background: '#09090b', padding: '8px 16px', borderRadius: '6px', border: '1px solid #27272a' }}
          >
            <RefreshCw size={14} />
            <span>Reset to Default</span>
          </button>
          <button 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#000000', cursor: 'pointer', background: '#06b6d4', padding: '8px 16px', borderRadius: '6px', border: 'none' }}
          >
            <Zap size={14} />
            <span>Simulation Running</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD MODAL PANELS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start', marginBottom: '24px' }}>
        
        {/* INTERACTIVE CONTROLS FORM PANEL */}
        <div style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 24px 0' }}>
            <Sliders size={16} style={{ color: '#06b6d4' }} />
            Simulation Controls
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Chefs */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <ChefHat size={18} style={{ color: '#38bdf8', marginTop: '2px' }} />
                  <div>
                    <span style={{ color: '#ffffff', fontWeight: '600', display: 'block' }}>Active Kitchen Chefs</span>
                    <span style={{ fontSize: '11px', color: '#71717a' }}>Controls throughput prep speeds.</span>
                  </div>
                </div>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>{chefCount} Chefs</span>
              </div>
              <input type="range" min="1" max="5" value={chefCount} onChange={(e) => handleSliderChange('chefCount', Number(e.target.value))} style={{ width: '100%', accentColor: '#06b6d4', background: '#18181b' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#71717a', marginTop: '4px', padding: '0 2px' }}>
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>

            {/* Riders */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Bike size={18} style={{ color: '#38bdf8', marginTop: '2px' }} />
                  <div>
                    <span style={{ color: '#ffffff', fontWeight: '600', display: 'block' }}>Active Delivery Riders</span>
                    <span style={{ fontSize: '11px', color: '#71717a' }}>Controls regional dispatch latency.</span>
                  </div>
                </div>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>{riderCount} Riders</span>
              </div>
              <input type="range" min="1" max="5" value={riderCount} onChange={(e) => handleSliderChange('riderCount', Number(e.target.value))} style={{ width: '100%', accentColor: '#06b6d4', background: '#18181b' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#71717a', marginTop: '4px', padding: '0 2px' }}>
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>

            {/* Cheese */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <ShoppingCart size={18} style={{ color: '#fbbf24', marginTop: '2px' }} />
                  <div>
                    <span style={{ color: '#ffffff', fontWeight: '600', display: 'block' }}>Cheese Inventory Target</span>
                    <span style={{ fontSize: '11px', color: '#71717a' }}>Under 60% stock causes operational prep delays.</span>
                  </div>
                </div>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>{Math.round(cheeseStock * 100)}% stock</span>
              </div>
              <input type="range" min="0.2" max="1.0" step="0.2" value={cheeseStock} onChange={(e) => handleSliderChange('cheeseStockRatio', Number(e.target.value))} style={{ width: '100%', accentColor: '#06b6d4', background: '#18181b' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#71717a', marginTop: '4px', padding: '0 2px' }}>
                <span>20%</span><span>40%</span><span>60%</span><span>80%</span><span>100%</span>
              </div>
            </div>

            {/* Avocado */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <ShoppingCart size={18} style={{ color: '#a3e635', marginTop: '2px' }} />
                  <div>
                    <span style={{ color: '#ffffff', fontWeight: '600', display: 'block' }}>Avocado Inventory Target</span>
                    <span style={{ fontSize: '11px', color: '#71717a' }}>Over 120% target triggers spoilage waste.</span>
                  </div>
                </div>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>{Math.round(avocadoStock * 100)}% stock</span>
              </div>
              <input type="range" min="0.5" max="2.5" step="0.5" value={avocadoStock} onChange={(e) => handleSliderChange('avocadoStockRatio', Number(e.target.value))} style={{ width: '100%', accentColor: '#06b6d4', background: '#18181b' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#71717a', marginTop: '4px', padding: '0 2px' }}>
                <span>50%</span><span>100%</span><span>150%</span><span>200%</span><span>250%</span>
              </div>
            </div>

            {/* Marketing */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <TrendingUp size={18} style={{ color: '#c084fc', marginTop: '2px' }} />
                  <div>
                    <span style={{ color: '#ffffff', fontWeight: '600', display: 'block' }}>Marketing Campaign Intensity</span>
                    <span style={{ fontSize: '11px', color: '#71717a' }}>Scales transaction velocity bounds.</span>
                  </div>
                </div>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>{marketingScale.toFixed(1)}x scale</span>
              </div>
              <input type="range" min="0.5" max="2.5" step="0.5" value={marketingScale} onChange={(e) => handleSliderChange('marketingSpendMultiplier', Number(e.target.value))} style={{ width: '100%', accentColor: '#06b6d4', background: '#18181b' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#71717a', marginTop: '4px', padding: '0 2px' }}>
                <span>0.5x</span><span>1.0x</span><span>1.5x</span><span>2.0x</span><span>2.5x</span>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECTIONS AND ALERT ENGINE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <TrendingUp size={16} style={{ color: '#06b6d4' }} />
                Projected Operational Impact
              </h3>
              <span style={{ fontSize: '11px', color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.05)', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
                Live Stream Active
              </span>
            </div>

            {/* REAL-TIME DYNAMIC GRID CALCULATIONS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              
              {/* Revenue */}
              <div style={{ padding: '16px', backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
                <span style={{ color: '#71717a', display: 'block', fontSize: '10px', fontWeight: '700' }}>PROJECTED REVENUE (TODAY)</span>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginTop: '6px', display: 'block' }}>
                  {formatCurrency(revenueTotal)}
                </span>
                <span style={{ color: revenueTotal >= baseRevenue ? '#22c55e' : '#ef4444', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  {revenueTotal >= baseRevenue ? '▲' : '▼'} {Math.abs(Math.round(((revenueTotal - baseRevenue)/baseRevenue)*100))}% vs baseline
                </span>
              </div>

              {/* Spoilage */}
              <div style={{ padding: '16px', backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
                <span style={{ color: '#71717a', display: 'block', fontSize: '10px', fontWeight: '700' }}>SPOILAGE WASTE COST</span>
                <span style={{ fontSize: '22px', fontWeight: '800', color: wasteCost > baseWaste ? '#f59e0b' : '#22c55e', marginTop: '6px', display: 'block' }}>
                  {formatCurrency(wasteCost)}
                </span>
                <span style={{ color: wasteCost <= baseWaste ? '#22c55e' : '#ef4444', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  {wasteCost >= baseWaste ? '▲' : '▼'} {Math.abs(Math.round(((wasteCost - baseWaste)/baseWaste)*100))}% vs baseline
                </span>
              </div>

              {/* Kitchen Prep Time */}
              <div style={{ padding: '16px', backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
                <span style={{ color: '#71717a', display: 'block', fontSize: '10px', fontWeight: '700' }}>KITCHEN PREP TIME (AVG)</span>
                <span style={{ fontSize: '22px', fontWeight: '800', color: averagePrepTimeSeconds > basePrepSeconds ? '#f59e0b' : '#ffffff', marginTop: '6px', display: 'block' }}>
                  {prepMinutes}m {prepSeconds}s
                </span>
                <span style={{ color: averagePrepTimeSeconds <= basePrepSeconds ? '#22c55e' : '#ef4444', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  {averagePrepTimeSeconds >= basePrepSeconds ? '▲' : '▼'} {Math.floor(Math.abs(averagePrepTimeSeconds - basePrepSeconds)/60)}m {Math.abs(averagePrepTimeSeconds - basePrepSeconds)%60}s vs baseline
                </span>
              </div>

              {/* Delivery SLA */}
              <div style={{ padding: '16px', backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
                <span style={{ color: '#71717a', display: 'block', fontSize: '10px', fontWeight: '700' }}>DELIVERY TRANSIT SLA</span>
                <span style={{ fontSize: '22px', fontWeight: '800', color: deliveryTransitSLA > 40 ? '#ef4444' : '#ffffff', marginTop: '6px', display: 'block' }}>
                  {deliveryTransitSLA} mins
                </span>
                <span style={{ color: deliveryTransitSLA <= baseDeliveryMins ? '#22c55e' : '#ef4444', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  {deliveryTransitSLA >= baseDeliveryMins ? '▲' : '▼'} {Math.abs(deliveryTransitSLA - baseDeliveryMins)} mins vs baseline
                </span>
              </div>

            </div>

            {/* LIVE SYSTEM HEALTH SCORE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#18181b', padding: '12px 16px', borderRadius: '8px', border: '1px solid #27272a' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: `3px solid ${scoreColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', lineHeight: 1 }}>{operationalScore}</span>
                <span style={{ fontSize: '8px', color: '#71717a' }}>/100</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: scoreColor }}>{scoreText}</span>
                  <span style={{ fontSize: '11px', color: scoreColor }}>
                    {operationalScore >= 76 ? '▲' : '▼'} {Math.abs(operationalScore - 76)} pts vs baseline
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#71717a', display: 'block', marginTop: '2px' }}>Operations calculated live based on stress boundaries.</span>
              </div>
            </div>

          </div>

          {/* DYNAMIC REAL-TIME ALERTS PANEL */}
          <div style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
              <span>Simulated AI Alerts Triggered ({simulatedAlerts.length})</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
              {simulatedAlerts.map(alert => (
                <div key={alert.id} style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#18181b', border: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <ShieldAlert size={16} style={{ color: alert.severity === 'critical' ? '#ef4444' : '#f59e0b' }} />
                    <div>
                      <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '13px', display: 'block' }}>{alert.title}</span>
                      <span style={{ fontSize: '11px', color: '#71717a' }}>{alert.desc}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: alert.severity === 'critical' ? '#ef4444' : '#f59e0b', backgroundColor: alert.severity === 'critical' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                    {alert.severity}
                  </span>
                </div>
              ))}
              {simulatedAlerts.length === 0 && (
                <div style={{ padding: '20px', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}>
                  <Info size={16} /> All systems clear. Simulation configurations are fully optimized.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* HORIZONTAL SUMMARY HEADER STRIP */}
      <div style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '16px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} style={{ color: '#06b6d4' }} />
          <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '13px' }}>Live Simulation Summary</span>
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#71717a', display: 'flex', alignItems: 'center', gap: '4px' }}><ShoppingBag size={12}/> Incoming Orders</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', display: 'block', marginTop: '2px' }}>{incomingOrders} <span style={{ fontSize: '10px', color: '#22c55e' }}>▲ {Math.round((marketingScale - 1)*100)}%</span></span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#71717a', display: 'flex', alignItems: 'center', gap: '4px' }}><Activity size={12}/> Kitchen Load</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: kitchenLoad > 85 ? '#ef4444' : '#ffffff', display: 'block', marginTop: '2px' }}>{kitchenLoad}%</span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#71717a', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> Avg. Prep Time</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', display: 'block', marginTop: '2px' }}>{prepMinutes}m {prepSeconds}s</span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#71717a', display: 'flex', alignItems: 'center', gap: '4px' }}><Bike size={12}/> On-Time Delivery</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: deliveryTransitSLA > 38 ? '#ef4444' : '#22c55e', display: 'block', marginTop: '2px' }}>{deliveryTransitSLA > 40 ? '78.2%' : '91.3%'}</span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#71717a', display: 'flex', alignItems: 'center', gap: '4px' }}><Trash2 size={12}/> Wastage Risk</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', display: 'block', marginTop: '2px' }}>{formatCurrency(wasteCost)}</span>
          </div>
        </div>
      </div>

      {/* MATRIX AND RECOMMENDATION PANEL */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px', paddingBottom: '24px' }}>
        
        {/* SCENARIO MATRIX */}
        <div style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
            <Award size={16} style={{ color: '#06b6d4' }} /> Scenario Comparison
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginTop: '16px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #27272a', color: '#71717a' }}>
                <th style={{ paddingBottom: '10px' }}>SCENARIO</th>
                <th style={{ paddingBottom: '10px' }}>REVENUE</th>
                <th style={{ paddingBottom: '10px' }}>SPOILAGE COST</th>
                <th style={{ paddingBottom: '10px' }}>PREP TIME (AVG)</th>
                <th style={{ paddingBottom: '10px' }}>ON-TIME DELIVERY</th>
                <th style={{ paddingBottom: '10px' }}>OPERATIONAL SCORE</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #27272a' }}>
                <td style={{ padding: '12px 0', color: '#a1a1aa' }}>● Baseline (Current)</td>
                <td style={{ color: '#ffffff' }}>₹1,44,000</td>
                <td style={{ color: '#ffffff' }}>₹6,580</td>
                <td style={{ color: '#ffffff' }}>19m 36s</td>
                <td style={{ color: '#ffffff' }}>84.6%</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>68 / 100</span>
                    <div style={{ width: '60px', height: '6px', backgroundColor: '#18181b', borderRadius: '3px' }}><div style={{ width: '68%', height: '100%', backgroundColor: '#71717a', borderRadius: '3px' }}/></div>
                  </div>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #27272a', backgroundColor: 'rgba(6,182,212,0.01)' }}>
                <td style={{ padding: '12px 0', color: '#38bdf8', fontWeight: '600' }}>● Current Simulation</td>
                <td style={{ color: '#ffffff' }}>{formatCurrency(revenueTotal)}</td>
                <td style={{ color: '#ffffff' }}>{formatCurrency(wasteCost)}</td>
                <td style={{ color: '#ffffff' }}>{prepMinutes}m {prepSeconds}s</td>
                <td style={{ color: '#ffffff' }}>{deliveryTransitSLA > 40 ? '78.2%' : '91.3%'}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#38bdf8', fontWeight: '600' }}>{operationalScore} / 100</span>
                    <div style={{ width: '60px', height: '6px', backgroundColor: '#18181b', borderRadius: '3px' }}><div style={{ width: `${operationalScore}%`, height: '100%', backgroundColor: scoreColor, borderRadius: '3px' }}/></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '12px 0', color: '#22c55e' }}>● Optimized Scenario</td>
                <td style={{ color: '#ffffff' }}>₹1,75,500 <span style={{ color: '#22c55e', fontSize: '10px' }}>▲ 21.9%</span></td>
                <td style={{ color: '#ffffff' }}>₹5,100 <span style={{ color: '#22c55e', fontSize: '10px' }}>▼ 22.5%</span></td>
                <td style={{ color: '#ffffff' }}>18m 12s <span style={{ color: '#22c55e', fontSize: '10px' }}>▼ 1m 24s</span></td>
                <td style={{ color: '#ffffff' }}>91.3% <span style={{ color: '#22c55e', fontSize: '10px' }}>▲ 6.7%</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#22c55e', fontWeight: '600' }}>89 / 100</span>
                    <div style={{ width: '60px', height: '6px', backgroundColor: '#18181b', borderRadius: '3px' }}><div style={{ width: '89%', height: '100%', backgroundColor: '#22c55e', borderRadius: '3px' }}/></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RECOMMENDATION CONSOLE */}
        <div style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={14} /> Optimization Tip
            </span>
            <p style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: '1.6', marginTop: '12px' }}>
              Add 1 more rider and reduce marketing intensity to 1.0x for better SLA & lower wastage.
            </p>
          </div>
          <button 
            onClick={applyOptimizationTip}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#18181b', border: '1px solid #27272a', color: '#38bdf8', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' }}
          >
            Apply Optimized Scenario
          </button>
        </div>

      </div>

    </div>
  );
};