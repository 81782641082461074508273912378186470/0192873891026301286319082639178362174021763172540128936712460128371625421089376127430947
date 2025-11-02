/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { CheckCircleIcon } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PlanDetails {
  title: string;
  price: number;
  description: string;
  features: PlanFeature[];
  licenseLimit: number;
}

interface PlanSelectorProps {
  selectedPlan: SubscriptionPlan | null;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

const plans: Record<SubscriptionPlan, PlanDetails> = {
  starter: {
    title: 'Starter',
    price: 5000,
    description: 'Perfect for beginners and hobbyists exploring the platform.',
    licenseLimit: 5,
    features: [
      { name: 'Unlimited Search Products', included: true },
      { name: 'Unlimited Scrape Product Details', included: true },
      { name: 'Unlimited Upload Products', included: true },
      { name: 'Data Backup', included: true },
      { name: '5 License Keys', included: true },
    ],
  },
  basic: {
    title: 'Basic',
    price: 10000,
    description: 'Ideal for small-scale dropshippers with moderate product management needs.',
    licenseLimit: 10,
    features: [
      { name: 'Unlimited Search Products', included: true },
      { name: 'Unlimited Scrape Product Details', included: true },
      { name: 'Unlimited Upload Products', included: true },
      { name: 'Data Backup', included: true },
      { name: '10 License Keys', included: true },
      { name: 'Priority Support', included: true },
    ],
  },
  pro: {
    title: 'Pro',
    price: 15000,
    description: 'For professional dropshippers scaling their operations.',
    licenseLimit: 20,
    features: [
      { name: 'Unlimited Search Products', included: true },
      { name: 'Unlimited Scrape Product Details', included: true },
      { name: 'Unlimited Upload Products', included: true },
      { name: 'Data Backup', included: true },
      { name: '20 License Keys', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Discounted Add-ons', included: true },
    ],
  },
  enterprise: {
    title: 'Enterprise',
    price: 20000,
    description: 'Tailored for large-scale dropshipping businesses with high-volume requirements.',
    licenseLimit: 50,
    features: [
      { name: 'Unlimited Search Products', included: true },
      { name: 'Unlimited Scrape Product Details', included: true },
      { name: 'Unlimited Upload Products', included: true },
      { name: 'Data Backup', included: true },
      { name: 'Custom License Key Limit', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Discounted Add-ons', included: true },
      { name: 'Dedicated Account Manager', included: true },
    ],
  },
};

const PlanSelector: React.FC<PlanSelectorProps> = ({ selectedPlan, onSelectPlan }) => {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold text-white">Choose Your Plan</h2>
      <p className="text-white/70 text-sm">
        Select the plan that best fits your dropshipping needs.
      </p>

      <div className="flex flex-col w-full gap-4">
        {Object.entries(plans).map(([planId, plan]) => (
          <div
            key={planId}
            className={`flex flex-col p-5 rounded-lg border ${
              selectedPlan === planId
                ? 'bg-dark-700 border-white/50 border-[1px] text-white'
                : 'bg-dark-800 border-[1px] border-white/5 text-white/50'
            } cursor-pointer hover:bg-dark-700 transition-colors`}
            onClick={() => onSelectPlan(planId as SubscriptionPlan)}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold __gradient_text">{plan.title}</h3>
              <div className="text-right">
                <span className="text-lg font-bold">IDR {plan.price.toLocaleString()}</span>
                <span className="text-xs text-white/50">/month</span>
              </div>
            </div>

            <p className="text-sm mb-4">{plan.description}</p>

            <div className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircleIcon className="mr-2 h-4 w-4 text-green-400" />
                    {feature.name}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`mt-4 py-2 px-4 rounded-md w-full ${
                selectedPlan === planId ? 'bg-white text-black' : 'bg-dark-700 text-white'
              }`}
              onClick={() => onSelectPlan(planId as SubscriptionPlan)}>
              {selectedPlan === planId ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanSelector;
