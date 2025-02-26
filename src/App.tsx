import React, { useState } from 'react';
import { CircleDollarSign, Mail, Lock, User, Calendar, Hash, ArrowRight, KeyRound } from 'lucide-react';

interface FormErrors {
  fullName?: string;
  email?: string;
  cpf?: string;
  password?: string;
  confirmPassword?: string;
  birthDate?: string;
}

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  };

  const validateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const formatCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!isLogin) {
      if (!formData.fullName || formData.fullName.trim().length < 3) {
        newErrors.fullName = 'Nome completo deve ter pelo menos 3 caracteres';
      }

      if (!formData.cpf || !validateCPF(formData.cpf)) {
        newErrors.cpf = 'CPF inválido';
      }

      if (!formData.birthDate) {
        newErrors.birthDate = 'Data de nascimento é obrigatória';
      } else {
        const age = validateAge(formData.birthDate);
        if (age < 18) {
          newErrors.birthDate = 'Você deve ter pelo menos 18 anos';
        }
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Form is valid, proceed with submission
      console.log('Form submitted:', formData);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      fullName: '',
      email: '',
      cpf: '',
      password: '',
      confirmPassword: '',
      birthDate: '',
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CircleDollarSign className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">Finance Flow</h1>
          </div>
          <p className="text-gray-400">Gerencie suas finanças com simplicidade</p>
        </div>

        {showForgotPassword ? (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recuperar Senha</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Enviar Link de Recuperação
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Voltar ao login
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {isLogin ? 'Login' : 'Cadastro'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Nome Completo"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors`}
                        required
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-sm">{errors.fullName}</p>
                    )}

                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                          errors.birthDate ? 'border-red-500' : 'border-gray-300'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors`}
                        required
                      />
                    </div>
                    {errors.birthDate && (
                      <p className="text-red-500 text-sm">{errors.birthDate}</p>
                    )}

                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="cpf"
                        placeholder="CPF"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        maxLength={14}
                        className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                          errors.cpf ? 'border-red-500' : 'border-gray-300'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors`}
                        required
                      />
                    </div>
                    {errors.cpf && (
                      <p className="text-red-500 text-sm">{errors.cpf}</p>
                    )}
                  </>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors`}
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}

                {!isLogin && (
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirmar Senha"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors`}
                      required
                    />
                  </div>
                )}
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isLogin ? 'Entrar' : 'Cadastrar'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              {isLogin ? (
                <>
                  <button
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Esqueceu sua senha?
                  </button>
                  <p className="mt-4 text-gray-600">
                    Não tem uma conta?{' '}
                    <button
                      onClick={handleToggleMode}
                      className="text-blue-600 hover:text-blue-700 transition-colors font-semibold"
                    >
                      Cadastre-se
                    </button>
                  </p>
                </>
              ) : (
                <p className="text-gray-600">
                  Já tem uma conta?{' '}
                  <button
                    onClick={handleToggleMode}
                    className="text-blue-600 hover:text-blue-700 transition-colors font-semibold"
                  >
                    Faça login
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;