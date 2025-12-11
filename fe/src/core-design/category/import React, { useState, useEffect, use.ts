// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   LayoutDashboard, 
//   Package, 
//   Tags, 
//   Settings, 
//   Plus, 
//   Search, 
//   Barcode, 
//   User, 
//   DollarSign, 
//   Menu, 
//   ChevronRight, 
//   ChevronDown,
//   AlertCircle,
//   CheckCircle2,
//   Trash2,
//   FolderTree,
//   CornerDownRight
// } from 'lucide-react';

// // --- Mock Data & Initial State ---
// // We added 'parentId' to support nesting
// const INITIAL_CATEGORIES = [
//   { id: 'cat_1', name: 'Electronics', parentId: null, color: 'bg-blue-100 text-blue-800' },
//   { id: 'cat_1_1', name: 'Computers', parentId: 'cat_1', color: 'bg-blue-50 text-blue-700' },
//   { id: 'cat_1_1_1', name: 'Laptops', parentId: 'cat_1_1', color: 'bg-blue-50 text-blue-600' },
//   { id: 'cat_1_1_1_1', name: 'Gaming', parentId: 'cat_1_1_1', color: 'bg-blue-50 text-blue-600' },
//   { id: 'cat_1_2', name: 'Audio', parentId: 'cat_1', color: 'bg-blue-50 text-blue-700' },
//   { id: 'cat_2', name: 'Groceries', parentId: null, color: 'bg-green-100 text-green-800' },
//   { id: 'cat_2_1', name: 'Fresh Produce', parentId: 'cat_2', color: 'bg-green-50 text-green-700' },
//   { id: 'cat_3', name: 'Clothing', parentId: null, color: 'bg-purple-100 text-purple-800' },
// ];

// const INITIAL_ITEMS = [
//   { 
//     id: 'item_1', 
//     name: 'Pro Gaming Laptop 15"', 
//     sku: 'GM-LPT-001', 
//     category: 'cat_1_1_1_1', // Assigned to deep layer
//     vendor: 'TechGiant Dist.', 
//     price: 1299.99, 
//     quantity: 5,
//     minStock: 2 
//   },
//   { 
//     id: 'item_2', 
//     name: 'Organic Bananas', 
//     sku: 'FRT-BNN-001', 
//     category: 'cat_2_1', 
//     vendor: 'Green Earth Farms', 
//     price: 0.99, 
//     quantity: 150, 
//     minStock: 20 
//   },
//   {
//     id: 'item_3',
//     name: 'Generic HDMI Cable',
//     sku: 'CBL-HDMI-GEN',
//     category: 'cat_1', // Assigned to top layer
//     vendor: 'CableCo',
//     price: 5.99,
//     quantity: 50,
//     minStock: 10
//   }
// ];

// const COLOR_OPTIONS = [
//   { label: 'Blue', value: 'bg-blue-100 text-blue-800' },
//   { label: 'Green', value: 'bg-green-100 text-green-800' },
//   { label: 'Purple', value: 'bg-purple-100 text-purple-800' },
//   { label: 'Orange', value: 'bg-orange-100 text-orange-800' },
//   { label: 'Red', value: 'bg-red-100 text-red-800' },
//   { label: 'Gray', value: 'bg-gray-100 text-gray-800' },
// ];

// // --- Helper Functions for Tree Logic ---

// // 1. Build a Tree structure from flat array
// const buildCategoryTree = (categories) => {
//   const map = {};
//   const tree = [];
  
//   categories.forEach(cat => {
//     map[cat.id] = { ...cat, children: [] };
//   });

//   categories.forEach(cat => {
//     if (cat.parentId && map[cat.parentId]) {
//       map[cat.parentId].children.push(map[cat.id]);
//     } else {
//       tree.push(map[cat.id]);
//     }
//   });

//   return tree;
// };

// // 2. Get all child IDs for a category (recursive) - Used for filtering
// const getAllChildIds = (categoryId, allCategories) => {
//   let ids = [categoryId];
//   const directChildren = allCategories.filter(c => c.parentId === categoryId);
//   directChildren.forEach(child => {
//     ids = [...ids, ...getAllChildIds(child.id, allCategories)];
//   });
//   return ids;
// };

// // 3. Get Full Path Name (e.g., Electronics > Computers > Laptops)
// const getCategoryPath = (categoryId, allCategories) => {
//   let path = [];
//   let currentId = categoryId;
  
//   while (currentId) {
//     const cat = allCategories.find(c => c.id === currentId);
//     if (cat) {
//       path.unshift(cat.name);
//       currentId = cat.parentId;
//     } else {
//       break;
//     }
//   }
//   return path.join(' > ');
// };

// // --- Components ---

// const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1
//       ${active 
//         ? 'bg-indigo-50 text-indigo-600' 
//         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//       }`}
//   >
//     <Icon size={20} />
//     {label}
//   </button>
// );

// const StatCard = ({ title, value, icon: Icon, colorClass }) => (
//   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
//     <div>
//       <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
//       <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
//     </div>
//     <div className={`p-3 rounded-lg ${colorClass}`}>
//       <Icon size={24} />
//     </div>
//   </div>
// );

// const Notification = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 fade-in
//       ${type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
//       {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
//       <span className="text-sm font-medium">{message}</span>
//     </div>
//   );
// };

// // Recursive Category Tree Item Component
// const CategoryTreeItem = ({ node, level, onAddSub, onDelete }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const hasChildren = node.children && node.children.length > 0;

//   return (
//     <div className="select-none">
//       <div 
//         className={`flex items-center justify-between p-3 mb-2 rounded-lg border border-gray-100 bg-white hover:border-indigo-200 transition-all ${level > 0 ? 'ml-6' : ''}`}
//       >
//         <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
//           {hasChildren ? (
//             isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />
//           ) : (
//             <div className="w-4" /> 
//           )}
          
//           <span className={`px-2 py-0.5 rounded text-xs font-semibold ${node.color || 'bg-gray-100 text-gray-600'}`}>
//             L{level + 1}
//           </span>
          
//           <span className="font-medium text-gray-900">{node.name}</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <button 
//             onClick={(e) => { e.stopPropagation(); onAddSub(node.id); }}
//             className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors text-xs flex items-center gap-1"
//             title="Add Subcategory"
//           >
//             <Plus size={14} />
//             <span className="hidden sm:inline">Sub</span>
//           </button>
//           <button 
//             onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
//             className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
//             title="Delete Category"
//           >
//             <Trash2 size={14} />
//           </button>
//         </div>
//       </div>

//       {isOpen && hasChildren && (
//         <div className="border-l-2 border-gray-100 ml-5 pl-2">
//           {node.children.map(child => (
//             <CategoryTreeItem 
//               key={child.id} 
//               node={child} 
//               level={level + 1} 
//               onAddSub={onAddSub} 
//               onDelete={onDelete} 
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // --- Main Application ---

// export default function App() {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [notification, setNotification] = useState(null);
  
//   // Data State
//   const [storeName, setStoreName] = useState("My Awesome Store");
//   const [categories, setCategories] = useState(INITIAL_CATEGORIES);
//   const [items, setItems] = useState(INITIAL_ITEMS);

//   // Form States
//   const [newItem, setNewItem] = useState({
//     name: '', sku: '', category: '', vendor: '', price: '', quantity: '', minStock: '5', description: ''
//   });
  
//   // New Category State supports nesting
//   const [newCategory, setNewCategory] = useState({ name: '', color: COLOR_OPTIONS[0].value, parentId: '' });
//   const [isAddingCategory, setIsAddingCategory] = useState(false); // Modal toggle for category

//   // --- Handlers ---

//   const showNotification = (message, type = 'success') => {
//     setNotification({ message, type });
//   };

//   const handleCreateCategory = (e) => {
//     e.preventDefault();
//     if (!newCategory.name.trim()) return;

//     const category = {
//       id: `cat_${Date.now()}`,
//       name: newCategory.name,
//       color: newCategory.color,
//       parentId: newCategory.parentId || null // Logic: if empty string, it's a root category
//     };

//     setCategories([...categories, category]);
//     setNewCategory({ name: '', color: COLOR_OPTIONS[0].value, parentId: '' });
//     setIsAddingCategory(false);
//     showNotification(`Category "${category.name}" created!`);
//   };

//   const handleCreateItem = (e) => {
//     e.preventDefault();
//     if (!newItem.name || !newItem.category || !newItem.price) {
//       showNotification("Please fill in all required fields", "error");
//       return;
//     }

//     const item = {
//       id: `item_${Date.now()}`,
//       ...newItem,
//       price: parseFloat(newItem.price),
//       quantity: parseInt(newItem.quantity),
//       minStock: parseInt(newItem.minStock)
//     };

//     setItems([item, ...items]);
//     setNewItem({ name: '', sku: '', category: '', vendor: '', price: '', quantity: '', minStock: '5', description: '' });
//     showNotification("Item added to inventory successfully!");
//     setActiveTab('inventory');
//   };

//   const handleDeleteItem = (id) => {
//     setItems(items.filter(item => item.id !== id));
//     showNotification("Item removed", "success");
//   };

//   const handleDeleteCategory = (id) => {
//     // Check if items use this category OR its children
//     const childIds = getAllChildIds(id, categories);
//     const isUsed = items.some(item => childIds.includes(item.category));
    
//     if (isUsed) {
//       showNotification("Cannot delete: Items exist in this category or its subcategories", "error");
//       return;
//     }
    
//     // Also prevent deleting if it has subcategories (safety check, though logic above covers used ones)
//     const hasSubCats = categories.some(c => c.parentId === id);
//     if(hasSubCats) {
//          if(!confirm("This will delete all subcategories as well (since they are empty). Continue?")) return;
//          // Delete category and all its children
//          const idsToDelete = getAllChildIds(id, categories);
//          setCategories(categories.filter(c => !idsToDelete.includes(c.id)));
//     } else {
//         setCategories(categories.filter(c => c.id !== id));
//     }

//     showNotification("Category structure updated");
//   };

//   const openAddSubCategory = (parentId) => {
//     setNewCategory({ ...newCategory, parentId: parentId });
//     setIsAddingCategory(true);
//   };

//   // --- Views ---



//   const AddItemView = () => (
//     <div className="max-w-3xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Add New Item</h1>
//         <p className="text-gray-500">Assign item to any category layer</p>
//       </div>

//       <form onSubmit={handleCreateItem} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="p-6 space-y-6">
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
//               <input
//                 type="text"
//                 required
//                 value={newItem.name}
//                 onChange={(e) => setNewItem({...newItem, name: e.target.value})}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                 placeholder="Ex: Wireless Mouse"
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Category (Select Hierarchy) *</label>
//               <select
//                 required
//                 value={newItem.category}
//                 onChange={(e) => setNewItem({...newItem, category: e.target.value})}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-mono text-sm"
//               >
//                 <option value="">-- Select Category --</option>
//                 {/* Flattened list with indentation for visual hierarchy */}
//                 {categories.sort((a,b) => getCategoryPath(a.id, categories).localeCompare(getCategoryPath(b.id, categories))).map(cat => {
//                     const path = getCategoryPath(cat.id, categories);
//                     return <option key={cat.id} value={cat.id}>{path}</option>
//                 })}
//               </select>
//               {categories.length === 0 && (
//                 <p className="text-xs text-red-500 mt-1">Please create a category first.</p>
//               )}
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Vendor / Supplier</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
//                   <User size={18} />
//                 </div>
//                 <input
//                   type="text"
//                   value={newItem.vendor}
//                   onChange={(e) => setNewItem({...newItem, vendor: e.target.value})}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                   placeholder="Ex: Global Tech Supply"
//                 />
//               </div>
//             </div>
//           </div>

//           <hr className="border-gray-100" />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Barcode / SKU</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
//                   <Barcode size={18} />
//                 </div>
//                 <input
//                   type="text"
//                   value={newItem.sku}
//                   onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
//                   placeholder="Scan or enter code"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($) *</label>
//               <input
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 required
//                 value={newItem.price}
//                 onChange={(e) => setNewItem({...newItem, price: e.target.value})}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                 placeholder="0.00"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Initial Quantity</label>
//               <input
//                 type="number"
//                 min="0"
//                 required
//                 value={newItem.quantity}
//                 onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                 placeholder="0"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert Level</label>
//               <input
//                 type="number"
//                 min="0"
//                 value={newItem.minStock}
//                 onChange={(e) => setNewItem({...newItem, minStock: e.target.value})}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
//           <button
//             type="button"
//             onClick={() => setActiveTab('inventory')}
//             className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
//           >
//             Add Item to Store
//           </button>
//         </div>
//       </form>
//     </div>
//   );

//   const InventoryView = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterCategory, setFilterCategory] = useState('all');

//     const filteredItems = items.filter(item => {
//       // 1. Text Search
//       const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                            (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()));
      
//       // 2. Recursive Category Filter
//       // If 'all', match everything. 
//       // If specific category, match that category AND all its children.
//       let matchesCategory = true;
//       if (filterCategory !== 'all') {
//           const validCategoryIds = getAllChildIds(filterCategory, categories);
//           matchesCategory = validCategoryIds.includes(item.category);
//       }

//       return matchesSearch && matchesCategory;
//     });

//     return (
//       <div className="space-y-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
//             <p className="text-gray-500">Manage stock and items</p>
//           </div>
//           <button
//             onClick={() => setActiveTab('add-item')}
//             className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
//           >
//             <Plus size={18} />
//             Add New Item
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search by name, SKU..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <select
//             value={filterCategory}
//             onChange={(e) => setFilterCategory(e.target.value)}
//             className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[200px]"
//           >
//             <option value="all">All Categories</option>
//             {/* Show hierarchy in filter too */}
//             {categories.sort((a,b) => getCategoryPath(a.id, categories).localeCompare(getCategoryPath(b.id, categories))).map(cat => {
//                 const path = getCategoryPath(cat.id, categories);
//                 // Indent with unicode spaces based on depth is also an option, but path string is clearer
//                 return <option key={cat.id} value={cat.id}>{path}</option>
//             })}
//           </select>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead className="bg-gray-50 border-b border-gray-100">
//                 <tr>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Path</th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Price</th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Stock</th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {filteredItems.map(item => {
//                   const category = categories.find(c => c.id === item.category);
//                   const isLowStock = item.quantity <= item.minStock;
//                   const categoryPath = getCategoryPath(item.category, categories);

//                   return (
//                     <tr key={item.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div>
//                           <p className="font-medium text-gray-900">{item.name}</p>
//                           <p className="text-xs text-gray-500 font-mono">{item.sku || 'N/A'}</p>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         {category ? (
//                           <div className="flex flex-col items-start gap-1">
//                              <span className="text-xs text-gray-500">{categoryPath}</span>
//                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${category.color}`}>
//                                 {category.name}
//                              </span>
//                           </div>
//                         ) : (
//                           <span className="text-gray-400 text-sm">Uncategorized</span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">{item.vendor || '-'}</td>
//                       <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
//                         ${item.price.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 text-center">
//                         <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium
//                           ${isLowStock ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
//                           {item.quantity}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-right">
//                         <button 
//                           onClick={() => handleDeleteItem(item.id)}
//                           className="text-gray-400 hover:text-red-600 transition-colors"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//           {filteredItems.length === 0 && (
//             <div className="p-12 text-center text-gray-500">
//               No items found matching your search.
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex font-sans">
//       {notification && (
//         <Notification 
//           message={notification.message} 
//           type={notification.type} 
//           onClose={() => setNotification(null)} 
//         />
//       )}

//       {/* Mobile Sidebar Overlay */}
//       {isSidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black/20 z-20 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside className={`
//         fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
//         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//       `}>
//         <div className="h-full flex flex-col">
//           <div className="p-6 border-b border-gray-100 flex items-center gap-3">
//             <div className="bg-indigo-600 p-2 rounded-lg text-white">
//               <Package size={24} />
//             </div>
//             <div>
//               <h2 className="font-bold text-gray-900 leading-tight">StoreAdmin</h2>
//               <p className="text-xs text-gray-500">Inventory System</p>
//             </div>
//           </div>

//           <nav className="flex-1 p-4 space-y-1">
//             <SidebarItem 
//               icon={LayoutDashboard} 
//               label="Dashboard" 
//               active={activeTab === 'dashboard'} 
//               onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }} 
//             />
//             <SidebarItem 
//               icon={Package} 
//               label="Inventory" 
//               active={activeTab === 'inventory'} 
//               onClick={() => { setActiveTab('inventory'); setSidebarOpen(false); }} 
//             />
//             <SidebarItem 
//               icon={Tags} 
//               label="Categories" 
//               active={activeTab === 'categories'} 
//               onClick={() => { setActiveTab('categories'); setSidebarOpen(false); }} 
//             />
//             <div className="pt-4 mt-4 border-t border-gray-100">
//                <button
//                 onClick={() => { setActiveTab('add-item'); setSidebarOpen(false); }}
//                 className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
//               >
//                 <Plus size={18} />
//                 Add Item
//               </button>
//             </div>
//           </nav>

//           <div className="p-4 border-t border-gray-100">
//             <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
//               <div className="bg-gray-200 rounded-full p-2">
//                 <Settings size={16} className="text-gray-600" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-900 truncate">{storeName}</p>
//                 <p className="text-xs text-gray-500">Manager</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col h-screen overflow-hidden">
//         {/* Mobile Header */}
//         <header className="bg-white border-b border-gray-200 lg:hidden px-4 py-3 flex items-center justify-between">
//           <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
//             <Menu size={24} />
//           </button>
//           <span className="font-semibold text-gray-900">StoreAdmin</span>
//           <div className="w-6" /> {/* Spacer */}
//         </header>

//         {/* Scrollable Content Area */}
//         <div className="flex-1 overflow-y-auto p-4 lg:p-8">
//           {activeTab === 'dashboard' && <DashboardView />}
//           {activeTab === 'categories' && <CategoriesView />}
//           {activeTab === 'inventory' && <InventoryView />}
//           {activeTab === 'add-item' && <AddItemView />}
//         </div>
//       </main>
//     </div>
//   );
// }