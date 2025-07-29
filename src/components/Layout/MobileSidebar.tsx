import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Settings, 
  Store,
  Truck,
  MessageSquare,
  CreditCard,
  Tag,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ activeTab, setActiveTab, isOpen, onClose }: MobileSidebarProps) {
  const { state } = useApp();

  const getMenuItems = () => {
    const role = state.currentUser?.role;
    
    switch (role) {
      case 'wholesaler':
        return [
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'orders', label: 'Orders', icon: ShoppingCart },
          { id: 'promotions', label: 'Promotions', icon: Tag },
          { id: 'support', label: 'Support', icon: MessageSquare },
          { id: 'profile', label: 'Profile', icon: Settings }
        ];
      case 'retailer':
        return [
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'browse', label: 'Browse Products', icon: Store },
          { id: 'orders', label: 'My Orders', icon: ShoppingCart },
          { id: 'payments', label: 'Payments', icon: CreditCard },
          { id: 'support', label: 'Support', icon: MessageSquare },
          { id: 'profile', label: 'Profile', icon: Settings }
        ];
      case 'admin':
        return [
          { id: 'overview', label: 'Dashboard', icon: BarChart3 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'orders', label: 'All Orders', icon: ShoppingCart },
          { id: 'products', label: 'All Products', icon: Package },
          { id: 'promotions', label: 'Promotions', icon: Tag },
          { id: 'analytics', label: 'Wholesaler Analytics', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'support':
        return [
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
          { id: 'returns', label: 'Return Requests', icon: Truck },
          { id: 'orders', label: 'Order Issues', icon: ShoppingCart },
          { id: 'users', label: 'User Support', icon: Users }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (tabId: string) => {
    setActiveTab(tabId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-white/95 backdrop-blur-sm shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold">N</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">NWI B2B</h2>
              <p className="text-xs text-gray-500 truncate">Menu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 sm:p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-blue-50 flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-gray-600 font-bold text-sm sm:text-lg">
                {state.currentUser?.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{state.currentUser?.name}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                state.currentUser?.role === 'wholesaler' ? 'bg-green-100 text-green-800' :
                state.currentUser?.role === 'retailer' ? 'bg-orange-100 text-orange-800' :
                state.currentUser?.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                state.currentUser?.role === 'support' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {state.currentUser?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 sm:p-6 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl text-left transition-all duration-200 font-medium text-sm sm:text-base ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="font-semibold truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}