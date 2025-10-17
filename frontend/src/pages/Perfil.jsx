import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Layout/Header';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { useToast } from '../hooks/use-toast';
import { User, Mail, Phone, FileText, MapPin, Calendar, Edit2 } from 'lucide-react';

const Perfil = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    cpf: user?.cpf || '',
    address: user?.address || '',
    birthdate: user?.birthdate || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: 'Perfil atualizado',
      description: 'Suas informações foram atualizadas com sucesso',
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>

        <Card className="bg-white p-8">
          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b">
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl font-bold">
                  {(user?.name || user?.email)?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name || user?.email?.split('@')[0]}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                  {user?.role === 'organizer' ? 'Organizador' : 'Usuário'}
                </span>
              </div>
            </div>
            
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="flex items-center"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>

          {/* Profile Form */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="cpf" className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="birthdate" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    Data de Nascimento
                  </Label>
                  <Input
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address" className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    Endereço
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Salvar Alterações
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Nome Completo</span>
                  </div>
                  <p className="text-gray-900">{user?.name || 'Não informado'}</p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Telefone</span>
                  </div>
                  <p className="text-gray-900">{user?.phone || 'Não informado'}</p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">CPF</span>
                  </div>
                  <p className="text-gray-900">{user?.cpf || 'Não informado'}</p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Data de Nascimento</span>
                  </div>
                  <p className="text-gray-900">{formatDate(user?.birthdate) || 'Não informado'}</p>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Endereço</span>
                  </div>
                  <p className="text-gray-900">{user?.address || 'Não informado'}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Perfil;
