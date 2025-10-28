import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { servicesAPI } from '../services/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { useToast } from '../hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { serviceTypes } from '../mock/mockData';

const NovoServico = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    photo: '',
    location: '',
    availability_days: [],
    time_slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  });

  const weekDays = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availability_days: prev.availability_days.includes(day)
        ? prev.availability_days.filter(d => d !== day)
        : [...prev.availability_days, day]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.description) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive'
      });
      return;
    }

    if (formData.availability_days.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione pelo menos um dia disponível',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Serviço criado!',
      description: 'Seu serviço foi cadastrado com sucesso',
    });
    
    navigate('/meus-servicos');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/meus-servicos')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastrar Novo Serviço</h1>
          <p className="text-gray-600">Preencha as informações do serviço que você deseja oferecer</p>
        </div>

        <Card className="bg-white p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Básicas</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Serviço *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Ex: Corte de Cabelo Gratuito"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipo de Serviço *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Descreva detalhadamente o serviço que você oferece..."
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-2"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Endereço ou local de atendimento"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="photo">Foto do Serviço (opcional)</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Formato: JPG, PNG. Tamanho máximo: 5MB</p>
                </div>
              </div>
            </div>

            {/* Disponibilidade */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Disponibilidade</h2>
              
              <div>
                <Label>Dias Disponíveis *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {weekDays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={formData.availability_days.includes(day)}
                        onCheckedChange={() => handleDayToggle(day)}
                      />
                      <Label htmlFor={day} className="font-normal cursor-pointer">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/meus-servicos')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                Cadastrar Serviço
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default NovoServico;
