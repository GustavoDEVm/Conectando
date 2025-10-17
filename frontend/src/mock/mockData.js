// Mock data for Conectando application

export const mockUsers = [
  {
    id: '1',
    email: 'tomoli9706@ampdial.com',
    password: '12345678',
    name: 'tomoli9706',
    phone: '(22) 22222-2222',
    cpf: '234.567.891-00',
    address: 'teste',
    birthdate: '2000-11-11',
    role: 'user'
  },
  {
    id: '2',
    email: 'kaxafec531@datoinf.com',
    password: '09876543',
    name: 'kaxafec531',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    address: 'Rua Exemplo, 123',
    birthdate: '1990-05-15',
    role: 'organizer'
  }
];

export const mockServices = [
  {
    id: '1',
    name: 'Corte de Cabelo Solidário',
    type: 'Beleza',
    description: 'Corte de cabelo gratuito para pessoas em situação de vulnerabilidade',
    photo: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400',
    organizer_id: '2',
    availability_days: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'],
    time_slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    location: 'Local não especificado',
    active: true
  },
  {
    id: '2',
    name: 'Dentista',
    type: 'Saúde',
    description: 'Consulta odontológica gratuita e tratamentos básicos',
    photo: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400',
    organizer_id: '2',
    availability_days: ['Terça-feira', 'Quinta-feira'],
    time_slots: ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'],
    location: 'Local não especificado',
    active: true
  },
  {
    id: '3',
    name: 'Aula de Informática',
    type: 'Educação',
    description: 'Aulas básicas de informática e inclusão digital',
    photo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
    organizer_id: '2',
    availability_days: ['Segunda-feira', 'Quarta-feira'],
    time_slots: ['10:00', '14:00', '16:00'],
    location: 'Centro Comunitário',
    active: true
  },
  {
    id: '4',
    name: 'Distribuição de Alimentos',
    type: 'Assistência Social',
    description: 'Distribuição de cestas básicas para famílias necessitadas',
    photo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400',
    organizer_id: '2',
    availability_days: ['Sábado'],
    time_slots: ['09:00', '10:00', '11:00'],
    location: 'Praça Central',
    active: true
  },
  {
    id: '5',
    name: 'Consulta Jurídica',
    type: 'Jurídico',
    description: 'Orientação jurídica gratuita para questões básicas',
    photo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
    organizer_id: '2',
    availability_days: ['Sexta-feira'],
    time_slots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    location: 'Escritório Comunitário',
    active: true
  },
  {
    id: '6',
    name: 'Apoio Psicológico',
    type: 'Saúde',
    description: 'Atendimento psicológico gratuito individual',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
    organizer_id: '2',
    availability_days: ['Terça-feira', 'Quinta-feira'],
    time_slots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    location: 'Clínica Social',
    active: true
  }
];

export const mockBookings = [
  {
    id: '1',
    user_id: '1',
    service_id: '1',
    date: '2025-10-18',
    time: '09:00',
    status: 'pending',
    notes: '',
    rating: null,
    created_at: '2025-10-15T10:00:00Z'
  },
  {
    id: '2',
    user_id: '1',
    service_id: '2',
    date: '2025-10-17',
    time: '09:10',
    status: 'completed',
    notes: 'teste eu',
    rating: 5,
    created_at: '2025-10-10T10:00:00Z'
  }
];

export const serviceTypes = [
  'Saúde',
  'Educação',
  'Beleza',
  'Assistência Social',
  'Jurídico',
  'Alimentação',
  'Outros'
];

// Stats for dashboard
export const getStats = () => {
  return {
    totalUsers: 150,
    activeServices: 6,
    averageRating: 4.8
  };
};

// Get bookings by user
export const getBookingsByUser = (userId) => {
  return mockBookings
    .filter(b => b.user_id === userId)
    .map(booking => ({
      ...booking,
      service: mockServices.find(s => s.id === booking.service_id)
    }));
};

// Get bookings by organizer
export const getBookingsByOrganizer = (organizerId) => {
  const organizerServices = mockServices.filter(s => s.organizer_id === organizerId);
  const serviceIds = organizerServices.map(s => s.id);
  
  return mockBookings
    .filter(b => serviceIds.includes(b.service_id))
    .map(booking => ({
      ...booking,
      service: mockServices.find(s => s.id === booking.service_id),
      user: mockUsers.find(u => u.id === booking.user_id)
    }));
};

// Get services by organizer
export const getServicesByOrganizer = (organizerId) => {
  return mockServices.filter(s => s.organizer_id === organizerId);
};
