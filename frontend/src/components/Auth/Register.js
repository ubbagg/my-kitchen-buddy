import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Common/Button';
import Input from '../Common/Input';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dietaryPreferences: [],
    allergies: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const dietaryOptions = [
    'vegetarian',
    'vegan', 
    'gluten-free',
    'keto',
    'paleo',
    'dairy-free'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleDietaryChange = (option) => {
    setFormData({
      ...formData,
      dietaryPreferences: formData.dietaryPreferences.includes(option)
        ? formData.dietaryPreferences.filter(pref => pref !== option)
        : [...formData.dietaryPreferences, option]
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      dietaryPreferences: formData.dietaryPreferences,
      allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a)
    });
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ general: result.message });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your full name"
            />
            
            <Input
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
              placeholder="Create a password"
              required
            />
            
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
              placeholder="Confirm your password"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Preferences (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {dietaryOptions.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.dietaryPreferences.includes(option)}
                      onChange={() => handleDietaryChange(option)}
                      className="mr-2"
                    />
                    <span className="text-sm capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <Input
              label="Allergies (Optional)"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="e.g., nuts, shellfish, eggs (comma separated)"
            />
          </div>

          {errors.general && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          )}

          <div>
            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;