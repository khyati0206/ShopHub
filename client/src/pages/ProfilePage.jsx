import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAddresses(user.addresses || []);
    }
  }, [user]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const addAddress = () => {
    setAddresses([
      ...addresses,
      { fullName: '', street: '', city: '', state: '', zipCode: '', country: 'United States', phone: '', isDefault: false },
    ]);
  };

  const updateAddress = (index, field, value) => {
    const updated = [...addresses];
    updated[index] = { ...updated[index], [field]: value };
    setAddresses(updated);
  };

  const removeAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await updateProfile({ name, addresses });
      setMessage('Profile updated successfully!');
    } catch {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-bold mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Saved Addresses</h2>
            <button type="button" onClick={addAddress} className="text-sm text-blue-600 hover:underline">
              + Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="text-gray-500 text-sm">No saved addresses</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Address {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  {['fullName', 'street', 'city', 'state', 'zipCode', 'phone'].map((field) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field.replace(/([A-Z])/g, ' $1')}
                      value={addr[field] || ''}
                      onChange={(e) => updateAddress(index, field, e.target.value)}
                      className="input-field text-sm"
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {message && (
          <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary py-3 px-8 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
