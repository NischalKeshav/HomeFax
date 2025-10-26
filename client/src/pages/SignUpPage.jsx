import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001/api';

function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    adminKey: '',
    company: '',
    contractorRole: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const contractorRoles = [
    'General Contractor',
    'Electrician',
    'Plumber',
    'HVAC Technician',
    'Roofing Contractor',
    'Flooring Specialist',
    'Painter',
    'Landscaper',
    'Architect',
    'Engineer'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role,
      adminKey: '',
      company: '',
      contractorRole: ''
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.role === 'admin' && !formData.adminKey) {
      setError('Admin key is required for admin registration');
      return false;
    }

    if (formData.role === 'contractor' && (!formData.company || !formData.contractorRole)) {
      setError('Company and contractor role are required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          adminKey: formData.adminKey || undefined,
          company: formData.company || undefined,
          contractorRole: formData.contractorRole || undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! Redirecting to dashboard...');
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to appropriate dashboard
        setTimeout(() => {
          navigate(`/dashboard/${data.user.role}`);
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-black mb-4">
            Sign Up
          </h1>
          <p className="text-xl text-gray-600">
            Create your HomeFax account
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Choose Your Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleRoleChange('homeowner')}
              className={`p-6 rounded-lg border-2 transition-colors ${
                formData.role === 'homeowner'
                  ? 'border-amber-800 bg-amber-50 text-amber-800'
                  : 'border-gray-300 hover:border-amber-600'
              }`}
            >
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Homeowner</h3>
                <p className="text-sm text-gray-600">Manage your property information</p>
              </div>
            </button>

            <button
              onClick={() => handleRoleChange('contractor')}
              className={`p-6 rounded-lg border-2 transition-colors ${
                formData.role === 'contractor'
                  ? 'border-amber-800 bg-amber-50 text-amber-800'
                  : 'border-gray-300 hover:border-amber-600'
              }`}
            >
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Contractor</h3>
                <p className="text-sm text-gray-600">Track projects and access properties</p>
              </div>
            </button>

            <button
              onClick={() => handleRoleChange('admin')}
              className={`p-6 rounded-lg border-2 transition-colors ${
                formData.role === 'admin'
                  ? 'border-amber-800 bg-amber-50 text-amber-800'
                  : 'border-gray-300 hover:border-amber-600'
              }`}
            >
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Admin</h3>
                <p className="text-sm text-gray-600">Manage city-wide data and approvals</p>
              </div>
            </button>
          </div>
        </div>

        {/* Registration Form */}
        {formData.role && (
          <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="Create a password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              {/* Role-specific Information */}
              <div className="space-y-4">
                {formData.role === 'admin' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Admin Key *
                    </label>
                    <input
                      type="text"
                      name="adminKey"
                      value={formData.adminKey}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                      placeholder="Enter admin key"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Contact your system administrator for an admin key
                    </p>
                  </div>
                )}

                {formData.role === 'contractor' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                        placeholder="Enter company name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Contractor Role *
                      </label>
                      <select
                        name="contractorRole"
                        value={formData.contractorRole}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                        required
                      >
                        <option value="">Select your role</option>
                        {contractorRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {formData.role === 'homeowner' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Homeowner Registration</h3>
                    <p className="text-sm text-blue-700">
                      Your name must match a property owner in our database. If you don't see your property, 
                      contact support to add your property information.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-semibold">Error:</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                <p className="font-semibold">Success:</p>
                <p className="text-sm">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-900 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Quick Sign In Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/signin')}
              className="text-amber-800 font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
