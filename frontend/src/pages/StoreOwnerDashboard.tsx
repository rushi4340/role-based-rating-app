import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface RatingInfo {
  id: number;
  rating: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface Store {
  id: number;
  name: string;
  address: string;
  averageRating: number;
  totalRatings: number;
  ratings: RatingInfo[];
}

const StoreOwnerDashboard: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '' });

  const fetchStores = async () => {
    try {
      const res = await api.get('/stores/my-stores');
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/stores', newStore);
      setNewStore({ name: '', email: '', address: '' });
      setShowAddForm(false);
      fetchStores(); // refresh list
    } catch (err) {
      console.error('Failed to create store', err);
    }
  };

  if (loading) return <div>Loading your stores...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Stores Dashboard</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn-primary"
        >
          {showAddForm ? 'Cancel' : 'Add New Store'}
        </button>
      </div>

      {showAddForm && (
        <div className="card p-6">
          <h2 className="text-lg font-medium mb-4">Add a New Store</h2>
          <form onSubmit={handleCreateStore} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input type="text" required className="input-field" value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
              <input type="email" required className="input-field" value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" required className="input-field" value={newStore.address} onChange={e => setNewStore({...newStore, address: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn-primary">Create Store</button>
            </div>
          </form>
        </div>
      )}

      {stores.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">
          You don't have any stores yet. Create one to start receiving ratings!
        </div>
      ) : (
        <div className="space-y-6">
          {stores.map(store => (
            <div key={store.id} className="card overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                  <p className="text-sm text-gray-500">{store.address}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-500">{store.averageRating > 0 ? store.averageRating : 'N/A'} ★</div>
                  <div className="text-sm text-gray-500">{store.totalRatings} user ratings</div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-md font-medium text-gray-700 mb-4">Recent Ratings</h4>
                {store.ratings.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No ratings received yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {store.ratings.map(rating => (
                      <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900">{rating.user.name}</span>
                          <span className="flex text-yellow-400">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} className={star <= rating.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                            ))}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{rating.user.email}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
