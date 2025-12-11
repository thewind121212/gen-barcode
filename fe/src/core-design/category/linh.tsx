import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Settings, 
  Plus, 
  Search, 
  Barcode, 
  User, 
  DollarSign, 
  Menu, 
  X, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  Trash2,
  LayoutGrid,
  List,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

// --- Mock Data & Initial State ---
const INITIAL_CATEGORIES = [
  { id: 'cat_1', name: 'Electronics', color: 'bg-blue-100 text-blue-800' },
  { id: 'cat_2', name: 'Groceries', color: 'bg-green-100 text-green-800' },
  { id: 'cat_3', name: 'Clothing', color: 'bg-purple-100 text-purple-800' },
];

const INITIAL_ITEMS = [
  { 
    id: 'item_1', 
    name: 'Wireless Headphones', 
    sku: 'WH-001-BLU', 
    category: 'cat_1', 
    vendor: 'TechGiant Dist.', 
    price: 129.99, 
    quantity: 15,
    minStock: 5 
  },
  { 
    id: 'item_2', 
    name: 'Organic Coffee Beans', 
    sku: 'GRO-CF-500', 
    category: 'cat_2', 
    vendor: 'Green Earth Farms', 
    price: 18.50, 
    quantity: 4, 
    minStock: 10 
  },
];

const COLOR_OPTIONS = [
  { label: 'Blue', value: 'bg-blue-100 text-blue-800' },
  { label: 'Green', value: 'bg-green-100 text-green-800' },
  { label: 'Purple', value: 'bg-purple-100 text-purple-800' },
  { label: 'Orange', value: 'bg-orange-100 text-orange-800' },
  { label: 'Red', value: 'bg-red-100 text-red-800' },
  { label: 'Gray', value: 'bg-gray-100 text-gray-800' },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1
      ${active 
        ? 'bg-indigo-50 text-indigo-600' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
  >
    <Icon size={20} />
    {label}
  </button>
);

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon size={24} />
    </div>
  </div>
);

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 fade-in
      ${type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Data State
  const [storeName, setStoreName] = useState("My Awesome Store");
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [items, setItems] = useState(INITIAL_ITEMS);

  // Form States
  const [newItem, setNewItem] = useState({
    name: '', sku: '', category: '', vendor: '', price: '', quantity: '', minStock: '5', description: ''
  });
  const [newCategory, setNewCategory] = useState({ name: '', color: COLOR_OPTIONS[0].value });

  // View Preference State
  const [categoryViewMode, setCategoryViewMode] = useState('grid'); // 'grid' | 'list'

  // --- Handlers ---

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    const category = {
      id: `cat_${Date.now()}`,
      name: newCategory.name,
      color: newCategory.color
    };

    setCategories([...categories, category]);
    setNewCategory({ name: '', color: COLOR_OPTIONS[0].value });
    showNotification(`Category "${category.name}" created!`);
  };

  const handleCreateItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.category || !newItem.price) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    const item = {
      id: `item_${Date.now()}`,
      ...newItem,
      price: parseFloat(newItem.price),
      quantity: parseInt(newItem.quantity),
      minStock: parseInt(newItem.minStock)
    };

    setItems([item, ...items]);
    setNewItem({ name: '', sku: '', category: '', vendor: '', price: '', quantity: '', minStock: '5', description: '' });
    showNotification("Item added to inventory successfully!");
    setActiveTab('inventory');
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    showNotification("Item removed", "success");
  };

  const handleDeleteCategory = (id) => {
    const isUsed = items.some(item => item.category === id);
    if (isUsed) {
      showNotification("Cannot delete category containing items", "error");
      return;
    }
    setCategories(categories.filter(c => c.id !== id));
    showNotification("Category deleted");
  };

  // Helper to calculate stats for a category
  const getCategoryStats = (catId) => {
    const catItems = items.filter(i => i.category === catId);
    const totalQty = catItems.reduce((acc, i) => acc + i.quantity, 0);
    const totalValue = catItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const lowStockCount = catItems.filter(i => i.quantity <= i.minStock).length;
    return { 
      itemCount: catItems.length, 
      totalQty, 
      totalValue,
      lowStockCount 
    };
  };

  // --- Views ---

  const DashboardView = () => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const lowStockItems = items.filter(item => item.quantity <= item.minStock).length;
    const totalValue = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back to {storeName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Inventory Value" 
            value={`$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
            icon={DollarSign} 
            colorClass="bg-green-100 text-green-600" 
          />
          <StatCard 
            title="Total Items in Stock" 
            value={totalItems} 
            icon={Package} 
            colorClass="bg-blue-100 text-blue-600" 
          />
          <StatCard 
            title="Low Stock Alerts" 
            value={lowStockItems} 
            icon={AlertCircle} 
            colorClass="bg-red-100 text-red-600" 
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Recent Additions</h3>
            <button onClick={() => setActiveTab('inventory')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {items.slice(0, 5).map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.sku || 'No SKU'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${item.price}</p>
                  <p className="text-sm text-gray-500">{item.quantity} in stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const CategoriesView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500">Manage your product classifications</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setCategoryViewMode('grid')}
            className={`p-2 rounded transition-all ${categoryViewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setCategoryViewMode('list')}
            className={`p-2 rounded transition-all ${categoryViewMode === 'list' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Category Form - Compact */}
        <div className="lg:col-span-1">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-indigo-500"/> Add Category
            </h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  placeholder="e.g. Summer Collection"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Color</label>
                <div className="grid grid-cols-6 gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.label}
                      type="button"
                      onClick={() => setNewCategory({...newCategory, color: color.value})}
                      className={`h-6 w-full rounded flex items-center justify-center transition-all ${color.value} 
                        ${newCategory.color === color.value ? 'ring-2 ring-offset-1 ring-gray-400' : 'opacity-70 hover:opacity-100'}`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>

        {/* Category List - Responsive Grid or List */}
        <div className="lg:col-span-2">
          {categories.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No categories yet. Create one to get started!</p>
            </div>
          ) : (
            <div className={categoryViewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'flex flex-col space-y-3'}>
              {categories.map((cat) => {
                const stats = getCategoryStats(cat.id);
                
                // Common content logic
                const CardContent = () => (
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                         <div className={`w-3 h-3 rounded-full ${cat.color.split(' ')[0]}`}></div>
                         <h3 className="font-semibold text-gray-900 truncate max-w-[120px]">{cat.name}</h3>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded border border-gray-100">
                        <p className="text-xs text-gray-500">Items</p>
                        <p className="font-medium text-gray-900">{stats.itemCount}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded border border-gray-100">
                        <p className="text-xs text-gray-500">Value</p>
                        <p className="font-medium text-gray-900">${stats.totalValue.toLocaleString()}</p>
                      </div>
                    </div>

                    {stats.lowStockCount > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                        <AlertTriangle size={12} />
                        <span>{stats.lowStockCount} items low stock</span>
                      </div>
                    )}
                  </>
                );

                const ListContent = () => (
                   <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4 flex-1">
                          <span className={`w-2 h-10 rounded-full ${cat.color.split(' ')[0]}`}></span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                               <span>{stats.itemCount} items</span>
                               <span>•</span>
                               <span>${stats.totalValue.toLocaleString()} value</span>
                            </div>
                          </div>
                      </div>

                      <div className="flex items-center gap-6">
                          {stats.lowStockCount > 0 && (
                            <div className="flex items-center gap-1 text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">
                                <AlertTriangle size={12} />
                                <span className="hidden sm:inline">Low Stock</span>
                            </div>
                          )}
                          <button 
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                      </div>
                   </div>
                );

                return (
                  <div 
                    key={cat.id} 
                    className={`bg-white border border-gray-200 hover:border-indigo-300 transition-all group
                      ${categoryViewMode === 'grid' ? 'p-4 rounded-xl shadow-sm hover:shadow-md' : 'p-3 rounded-lg flex items-center shadow-sm'}`}
                  >
                    {categoryViewMode === 'grid' ? <CardContent /> : <ListContent />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const AddItemView = () => (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Item</h1>
        <p className="text-gray-500">Enter product details to create stock record</p>
      </div>

      <form onSubmit={handleCreateItem} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Ex: Wireless Mouse"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                required
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Please create a category first.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor / Supplier</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={newItem.vendor}
                  onChange={(e) => setNewItem({...newItem, vendor: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Ex: Global Tech Supply"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Inventory Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barcode / SKU</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Barcode size={18} />
                </div>
                <input
                  type="text"
                  value={newItem.sku}
                  onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono"
                  placeholder="Scan or enter code"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Quantity</label>
              <input
                type="number"
                min="0"
                required
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert Level</label>
              <input
                type="number"
                min="0"
                value={newItem.minStock}
                onChange={(e) => setNewItem({...newItem, minStock: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
          >
            Add Item to Store
          </button>
        </div>
      </form>
    </div>
  );

  const InventoryView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const filteredItems = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-500">Manage stock and items</p>
          </div>
          <button
            onClick={() => setActiveTab('add-item')}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={18} />
            Add New Item
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Price</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Stock</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map(item => {
                  const category = categories.find(c => c.id === item.category);
                  const isLowStock = item.quantity <= item.minStock;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{item.sku || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {category ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.color}`}>
                            {category.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">Uncategorized</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.vendor || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium
                          ${isLowStock ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredItems.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No items found matching your search.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Package size={24} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 leading-tight">StoreAdmin</h2>
              <p className="text-xs text-gray-500">Inventory System</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }} 
            />
            <SidebarItem 
              icon={Package} 
              label="Inventory" 
              active={activeTab === 'inventory'} 
              onClick={() => { setActiveTab('inventory'); setSidebarOpen(false); }} 
            />
            <SidebarItem 
              icon={Tags} 
              label="Categories" 
              active={activeTab === 'categories'} 
              onClick={() => { setActiveTab('categories'); setSidebarOpen(false); }} 
            />
            <div className="pt-4 mt-4 border-t border-gray-100">
               <button
                onClick={() => { setActiveTab('add-item'); setSidebarOpen(false); }}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
              <div className="bg-gray-200 rounded-full p-2">
                <Settings size={16} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{storeName}</p>
                <p className="text-xs text-gray-500">Manager</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 lg:hidden px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-900">StoreAdmin</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'categories' && <CategoriesView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'add-item' && <AddItemView />}
        </div>
      </main>
    </div>
  );
}