import type { OperationalAlert } from '../types/operationalData';

export function runAIEngine(
  chefCount: number,
  _riderCount: number,
  cheeseRatio: number,
  avocadoRatio: number,
  avgPrepTime: number,
  avgDeliveryTime: number
): OperationalAlert[] {
  const alerts: OperationalAlert[] = [];
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Cheese Stock Crisis
  if (cheeseRatio < 0.6) {
    alerts.push({
      id: 'alert-cheese',
      severity: 'critical',
      category: 'inventory',
      title: 'Cheese Stock Depletion',
      description: 'Mozzarella & Parmesan levels have dropped below safety thresholds, causing kitchen prep delays.',
      timestamp: nowStr,
      resolved: false,
      evidence: 'Cheese stock is currently at 12kg, which is 65% below the minimum safety stock limit of 35kg.',
      rootCause: 'Delayed supply shipment from Dairy Gold Farms. Lack of cheese stock in line-coolers forces chefs to walk to the basement cold-room freezer repeatedly to retrieve frozen packs.',
      prediction: 'Without immediate intervention, pizza preparation delays will lead to 15%+ order cancellations, dropping revenue by ₹18,500 tonight.',
      recommendation: 'Restock prep-line cheese immediately. Temporarily shift Chef B to Pizza Station to handle queue backlog.',
      businessImpact: 'Restores pizza prep time from 18 mins back to the standard 10 mins. Safeguards evening delivery revenue.',
      expectedSavings: '₹24,000 per week in cancellation prevention.',
      confidenceScore: 94
    });
  }

  // 2. North Zone Delivery Delay
  if (avgDeliveryTime > 38) {
    alerts.push({
      id: 'alert-delivery',
      severity: 'critical',
      category: 'delivery',
      title: 'North Zone Delivery Delay Spike',
      description: 'Delivery times in the North Zone have breached acceptable SLAs, triggering refund complaints.',
      timestamp: nowStr,
      resolved: false,
      evidence: 'North Zone average delivery transit time is 42 minutes, compared to the target SLA of 27 minutes. 3 critical delivery ratings recorded.',
      rootCause: 'Rider deficit (only 2 active riders in North Zone) during peak order surge. Delayed dispatch from Pizza Station added 12 minutes to wait times.',
      prediction: 'Customers in North Zone will cancel orders or switch to competitors. Customer retention index in North Zone could drop by 14% this month.',
      recommendation: 'Re-assign one rider from West Zone to North Zone immediately. Integrate on-demand external logistics (e.g. Dunzo/Shadowfax) as backup.',
      businessImpact: 'Brings average delivery times down to 29 minutes, stabilizing customer experience ratings.',
      expectedSavings: '₹18,000 per week in refunded order savings.',
      confidenceScore: 92
    });
  }

  // 3. Avocado Food Spoilage Waste
  if (avocadoRatio > 1.4) {
    alerts.push({
      id: 'alert-avocado',
      severity: 'warning',
      category: 'inventory',
      title: 'High Avocado Spoilage Alert',
      description: 'Avocado inventory is building up faster than consumption, resulting in high organic waste cost.',
      timestamp: nowStr,
      resolved: false,
      evidence: 'Avocado waste percentage is at 26%, exceeding the safety threshold of 18%. Spoiled item weight at 15kg.',
      rootCause: 'Bulk over-purchasing from supplier Organic Greens Inc. compounded by a 20% decline in Crispy Avocado Taco sales this week.',
      prediction: 'Direct ingredient loss will dump ₹8,400 in food stock costs into trash bins by Tuesday.',
      recommendation: 'Reduce the next replenishment order by 40%. Run a "Chef Special" campaign promoting Avocado Toast/Burrata Salad to flush active stock.',
      businessImpact: 'Trims avocado wastage back to 10%, improving recipe gross margin by 4.5%.',
      expectedSavings: '₹12,200 in raw ingredient costs.',
      confidenceScore: 89
    });
  }

  // 4. Pizza Station Bottleneck
  if (avgPrepTime > 840 && chefCount < 4) {
    alerts.push({
      id: 'alert-kitchen',
      severity: 'warning',
      category: 'kitchen',
      title: 'Pizza Station Kitchen Bottleneck',
      description: 'Order preparation time at Pizza Station is slowing down operations due to staff limitations.',
      timestamp: nowStr,
      resolved: false,
      evidence: 'Average pizza station prep duration is 18 minutes (target: 10 mins). Active kitchen load is at 84%.',
      rootCause: 'Pizza station is staffed by a single chef during a 35% pizza order surge triggered by active promotion campaigns.',
      prediction: 'Slowing kitchen output will violate third-party delivery service level agreements, incurring platform penalties.',
      recommendation: 'Reallocate Chef B to the Pizza Station immediately during peak rush hours (19:00 - 21:00). Pause digital pizza promotions.',
      businessImpact: 'Lowers station preparation times to 11 minutes, smoothing kitchen dispatch flow.',
      expectedSavings: '₹15,000 in saved platform penalty costs and customer goodwill.',
      confidenceScore: 91
    });
  }

  // Fallback info alert if everything is green
  if (alerts.length === 0) {
    alerts.push({
      id: 'alert-healthy',
      severity: 'info',
      category: 'kitchen',
      title: 'All Operational Parameters Optimal',
      description: 'FlowLens AI is monitoring all systems. No critical bottlenecks or alerts detected.',
      timestamp: nowStr,
      resolved: true,
      evidence: 'Metrics check: Cheese ratio at 1.0, Avocado ratio at 1.0, Staffing optimal, Delivery times average 28 minutes.',
      rootCause: 'Operations aligned with demand. Staff levels match kitchen ticket velocity.',
      prediction: 'Revenue forecast stable. No projected losses from cancellations or waste over the next 24 hours.',
      recommendation: 'Maintain current staffing roster. Keep existing inventory thresholds in place.',
      businessImpact: 'Steady profit margins, solid customer reviews, 98% on-time dispatch rate.',
      expectedSavings: '₹0 (Running at maximum efficiency)',
      confidenceScore: 99
    });
  }

  return alerts;
}
