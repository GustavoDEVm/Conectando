import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Layout/Header';
import { servicesAPI, bookingsAPI } from '../services/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Calendar } from '../components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { MapPin, Clock, Calendar as CalendarIcon } from 'lucide-react';

const Servicos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');

  // Carregar serviços ao montar o componente
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await servicesAPI.getAll();
      setServices(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os serviços',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    setBookingDate(null);
    setBookingTime('');
    setNotes('');
  };

  const handleConfirmBooking = async () => {
    if (!bookingDate || !bookingTime) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione data e horário',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Formata a data para YYYY-MM-DD
      const formattedDate = bookingDate.toISOString().split('T')[0];
      
      await bookingsAPI.create({
        service_id: selectedService.id,
        date: formattedDate,
        time: bookingTime,
        notes: notes
      });

      toast({
        title: 'Agendamento realizado!',
        description: 'Seu agendamento foi criado com sucesso',
      });
      
      setSelectedService(null);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: 'Erro',
        description: error.response?.data?.detail || 'Não foi possível criar o agendamento',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Serviços Disponíveis</h1>
          <p className="text-gray-600">Encontre e agende serviços comunitários gratuitos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="bg-white overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={service.photo || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400'}
                alt={service.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    {service.type}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {service.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {service.availability_days?.slice(0, 2).join(', ')}
                    {service.availability_days?.length > 2 && '...'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    {service.time_slots?.[0]} - {service.time_slots?.[service.time_slots.length - 1]}
                  </div>
                </div>
                
                <Button
                  onClick={() => handleBookService(service)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Agendar Serviço
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum serviço disponível no momento</p>
          </div>
        )}

        {/* Booking Dialog */}
        <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agendar {selectedService?.name}</DialogTitle>
              <DialogDescription>
                Selecione a data e horário desejados para o agendamento
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label>Data do Agendamento</Label>
                <Calendar
                  mode="single"
                  selected={bookingDate}
                  onSelect={setBookingDate}
                  className="rounded-md border mt-2"
                  disabled={(date) => date < new Date()}
                />
              </div>
              
              <div>
                <Label>Horário</Label>
                <Select value={bookingTime} onValueChange={setBookingTime}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedService?.time_slots?.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Observações (opcional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione observações sobre seu agendamento"
                  className="mt-2"
                  rows={3}
                />
              </div>
              
              <Button
                onClick={handleConfirmBooking}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Confirmar Agendamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Servicos;
