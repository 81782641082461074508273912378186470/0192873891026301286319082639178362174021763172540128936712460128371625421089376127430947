'use client';

import React, { useState } from 'react';
import { PaymentMethod, PaymentMethodConfig } from '@/types/payment';
import { getPaymentMethodsByCategory } from '@/lib/PaymentUtils';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  className?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('qris');

  // Get all enabled payment methods grouped by category
  const qrisMethods = getPaymentMethodsByCategory('qris');
  const eWalletMethods = getPaymentMethodsByCategory('e_wallet');
  const creditCardMethods = getPaymentMethodsByCategory('credit_card');
  const virtualAccountMethods = getPaymentMethodsByCategory('virtual_account');
  const internetBankingMethods = getPaymentMethodsByCategory('internet_banking');
  const retailMethods = getPaymentMethodsByCategory('retail_payment');
  const creditMethods = getPaymentMethodsByCategory('online_credit');

  const categories = [
    { id: 'qris', name: 'QRIS', methods: qrisMethods, icon: '📱' },
    { id: 'e_wallet', name: 'E-Wallet', methods: eWalletMethods, icon: '💳' },
    { id: 'credit_card', name: 'Credit Card', methods: creditCardMethods, icon: '💳' },
    { id: 'virtual_account', name: 'Virtual Account', methods: virtualAccountMethods, icon: '🏦' },
    {
      id: 'internet_banking',
      name: 'Internet Banking',
      methods: internetBankingMethods,
      icon: '🌐',
    },
    { id: 'retail_payment', name: 'Retail', methods: retailMethods, icon: '🏪' },
    { id: 'online_credit', name: 'Pay Later', methods: creditMethods, icon: '📅' },
  ].filter((category) => category.methods.length > 0);

  const handleMethodSelect = (method: PaymentMethodConfig) => {
    onMethodChange(method.id);
  };

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Choose Payment Method</h3>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-white/20 pb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === category.id
                ? 'bg-white text-black'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}>
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories
          .find((cat) => cat.id === activeCategory)
          ?.methods.map((method) => (
            <div
              key={method.id}
              onClick={() => handleMethodSelect(method)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                selectedMethod === method.id
                  ? 'border-white bg-white/10 shadow-lg'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}>
              <div className="flex flex-col items-center text-center">
                {/* Payment Method Icon/Logo Placeholder */}
                <div
                  className={`w-12 h-12 rounded-lg mb-3 flex items-center justify-center text-2xl ${
                    method.category === 'qris'
                      ? 'bg-green-500/20'
                      : method.category === 'e_wallet'
                      ? 'bg-blue-500/20'
                      : method.category === 'credit_card'
                      ? 'bg-purple-500/20'
                      : method.category === 'virtual_account'
                      ? 'bg-yellow-500/20'
                      : method.category === 'internet_banking'
                      ? 'bg-cyan-500/20'
                      : method.category === 'retail_payment'
                      ? 'bg-orange-500/20'
                      : 'bg-pink-500/20'
                  }`}>
                  {method.category === 'qris' && '📱'}
                  {method.category === 'e_wallet' && '💰'}
                  {method.category === 'credit_card' && '💳'}
                  {method.category === 'virtual_account' && '🏦'}
                  {method.category === 'internet_banking' && '🌐'}
                  {method.category === 'retail_payment' && '🏪'}
                  {method.category === 'online_credit' && '📅'}
                </div>

                <h4 className="font-semibold text-white text-sm mb-1">{method.name}</h4>
                <p className="text-white/60 text-xs leading-tight">{method.description}</p>

                {/* Selection Indicator */}
                {selectedMethod === method.id && (
                  <div className="mt-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Selected Method Info */}
      {selectedMethod && (
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">
                Selected:{' '}
                {
                  categories
                    .flatMap((cat) => cat.methods)
                    .find((method) => method.id === selectedMethod)?.name
                }
              </h4>
              <p className="text-white/60 text-sm mt-1">
                {
                  categories
                    .flatMap((cat) => cat.methods)
                    .find((method) => method.id === selectedMethod)?.description
                }
              </p>
            </div>
            <div className="text-green-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
