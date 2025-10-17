import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Users, Calendar, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import Header from '../components/Layout/Header';
import { getStats } from '../mock/mockData';

const Inicio = () => {
  const { isOrganizer } = useAuth();
  const navigate = useNavigate();
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-14 h-14 text-white" fill="white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bem-vindo ao{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Conectando
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Facilitando o acesso a serviços comunitários gratuitos.
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Conectamos pessoas que precisam de ajuda com voluntários dispostos a ajudar.
          </p>
          
          <Button
            onClick={() => navigate(isOrganizer ? '/meus-servicos' : '/servicos')}
            className="h-12 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Ver Serviços Disponíveis
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalUsers}+</p>
              <p className="text-sm text-gray-600">Usuários Cadastrados</p>
            </div>
          </Card>

          <Card className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.activeServices}</p>
              <p className="text-sm text-gray-600">Serviços Ativos</p>
            </div>
          </Card>

          <Card className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.averageRating}</p>
              <p className="text-sm text-gray-600">Avaliação Média</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Inicio;
