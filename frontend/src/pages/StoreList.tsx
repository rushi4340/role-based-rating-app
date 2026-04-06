import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Rating {
  id: number;
  rating: number;
  userId: number;
  storeId: number;
}

interface Store {
  id: number;
  name: string;
  address: string;
  averageRating: number;
  totalRatings: number;
  ratings: Rating[];
}

const StoreList: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name or rating
  const { user } = useAuth();
  
  // Track ongoing submissions to show loading state per store
  const [submittingRating, setSubmittingRating] = useState<number | null>(null);

  const fetchStores = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (sortBy) queryParams.append('sortBy', sortBy);
      
      const res = await api.get(`/stores?${queryParams.toString()}`);
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch and fetch when dependencies change
    fetchStores();
  }, [search, sortBy]);

  const handleRate = async (storeId: number, rating: number) => {
    setSubmittingRating(storeId);
    try {
      await api.post('/ratings', { storeId, rating });
      // Refresh list to show updated average and user's new rating
      await fetchStores();
    } catch (err) {
      console.error('Failed to submit rating', err);
      alert('Failed to rate store. Please try again.');
    } finally {
      setSubmittingRating(null);
    }
  };

  const getUserRating = (store: Store) => {
    if (!user) return 0;
    const ratingObj = store.ratings.find(r => r.userId === user.id);
    return ratingObj ? ratingObj.rating : 0;
  };

  if (loading && stores.length === 0) return <div>Loading stores...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Browse Stores</h1>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search stores..." 
            className="input-field max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="input-field max-w-xs"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map(store => {
          const userCurrentRating = getUserRating(store);
          const isSubmitting = submittingRating === store.id;
          
          return (
            <div key={store.id} className="card p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                  <div className="bg-yellow-100 text-yellow-800 text-sm font-bold px-2 py-1 rounded">
                    {store.averageRating > 0 ? `${store.averageRating} ★` : 'No Ratings'}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">{store.address}</p>
                <div className="text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                  Based on {store.totalRatings} user ratings
                </div>
              </div>
              
              <div className="mt-auto pt-2">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {userCurrentRating > 0 ? "Your current rating (click to change):" : "Rate this store:"}
                </p>
                <div className={`flex items-center space-x-1 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      onClick={() => handleRate(store.id, star)}
                      className="text-2xl focus:outline-none focus:scale-110 transform transition-transform"
                      title={`Rate ${star} stars`}
                    >
                      <span className={star <= userCurrentRating ? "text-yellow-400 hover:text-yellow-500" : "text-gray-300 hover:text-yellow-300"}>
                        ★
                      </span>
                    </button>
                  ))}
                  {isSubmitting && <span className="text-xs text-gray-500 ml-2 animate-pulse">saving...</span>}
                </div>
              </div>
            </div>
          );
        })}
        {stores.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No stores found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreList;
