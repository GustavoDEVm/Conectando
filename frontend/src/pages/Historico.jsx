import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Layout/Header';
import { bookingsAPI } from '../services/api';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BarChart3, CheckCircle, XCircle, Clock, Star, Calendar } from 'lucide-react';

const Historico = () => {
  const { user } = useAuth();
  const [filterPeriod, setFilterPeriod] = useState('todos');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar agendamentos
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingsAPI.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    noShow: 0,
    avgRating: bookings.filter(b => b.rating).reduce((acc, b) => acc + b.rating, 0) / bookings.filter(b => b.rating).length || 0
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getMonthYear = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  // Group bookings by month
  const bookingsByMonth = bookings.reduce((acc, booking) => {
    const monthYear = getMonthYear(booking.date);
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(booking);
    return acc;
  }, {});

  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    } else if (status === 'completed') {
      return <Badge className="bg-blue-100 text-blue-800">Realizado</Badge>;
    } else if (status === 'cancelled') {
      return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Agendamentos</h1>
          <p className="text-gray-600">Visualize todo o seu histórico de serviços utilizados</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white p-4">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-600">Total de Agendamentos</p>
            </div>
          </Card>

          <Card className="bg-white p-4">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              <p className="text-xs text-gray-600">Realizados</p>
            </div>
          </Card>

          <Card className="bg-white p-4">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              <p className="text-xs text-gray-600">Cancelados</p>
            </div>
          </Card>

          <Card className="bg-white p-4">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.noShow}</p>
              <p className="text-xs text-gray-600">Não Compareceu</p>
            </div>
          </Card>

          <Card className="bg-white p-4">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
              <p className="text-xs text-gray-600">Média Avaliações</p>
            </div>
          </Card>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtrar por período:</span>
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os períodos</SelectItem>
              <SelectItem value="mes">Este mês</SelectItem>
              <SelectItem value="trimestre">Último trimestre</SelectItem>
              <SelectItem value="ano">Este ano</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">{bookings.length} agendamentos encontrados</span>
        </div>

        {/* Bookings Timeline */}
        <div className="space-y-8">
          {Object.entries(bookingsByMonth).map(([monthYear, monthBookings]) => (
            <div key={monthYear}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 capitalize">{monthYear}</h3>
                  <p className="text-sm text-gray-500">{monthBookings.length} agendamentos</p>
                </div>
              </div>

              <div className="space-y-3">
                {monthBookings.map((booking) => (
                  <Card key={booking.id} className="bg-white p-4 ml-16">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <img
                          src={booking.service.photo}
                          alt={booking.service.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{booking.service.name}</h4>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {getStatusBadge(booking.status)}
                            {booking.rating && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Star className="w-3 h-3 mr-1" fill="currentColor" />
                                Nota: {booking.rating}/5
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <span>{formatDate(booking.date)}</span>
                            <span>{booking.time}</span>
                            <span>{booking.service.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Historico;
