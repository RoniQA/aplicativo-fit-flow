import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditUserForm from '../EditUserForm';
import { UserProvider } from '../../contexts/UserContext';

// Mock do useUser para retornar dados de teste
const mockUseUser = jest.fn();

jest.mock('../../contexts/UserContext', () => ({
  ...jest.requireActual('../../contexts/UserContext'),
  useUser: () => mockUseUser()
}));

// Mock do window.confirm
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true
});

// Mock do window.alert
const mockAlert = jest.fn();
Object.defineProperty(window, 'alert', {
  value: mockAlert,
  writable: true
});

// Mock do window.location.href
delete (window as any).location;
window.location = { href: '' } as any;

const mockUser: any = {
  id: '1',
  name: 'Test User',
  age: 25,
  weight: 70,
  height: 170,
  gender: 'male',
  goal: 'maintain',
  activityLevel: 'medium',
  workoutLocation: 'home',
  bodyTypeGoal: 'toned',
  experienceLevel: 'beginner',
  physicalLimitations: ['knee injury'],
  dietaryPreferences: 'none',
  availableTime: '45min',
  createdAt: new Date()
};

const mockOnClose = jest.fn();

const renderWithProviders = (component: React.ReactElement) => {
  return render(component);
};

describe('EditUserForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(false);
    mockAlert.mockImplementation(() => {});
    
    // Configurar mock do useUser
    mockUseUser.mockReturnValue({
      user: mockUser,
      updateUser: jest.fn(),
      clearData: jest.fn()
    });
  });

  it('should render form fields correctly', () => {
    renderWithProviders(<EditUserForm onClose={mockOnClose} />);

    expect(screen.getByText('Editar Perfil')).toBeInTheDocument();
    expect(screen.getByLabelText('Gênero')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Idade')).toBeInTheDocument();
    expect(screen.getByLabelText('Peso (kg)')).toBeInTheDocument();
    expect(screen.getByLabelText('Altura (cm)')).toBeInTheDocument();
    expect(screen.getByLabelText('Objetivo')).toBeInTheDocument();
    expect(screen.getByLabelText('Nível de Atividade')).toBeInTheDocument();
    expect(screen.getByLabelText('Local de Treino')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo de Corpo Desejado')).toBeInTheDocument();
    expect(screen.getByLabelText('Nível de Experiência')).toBeInTheDocument();
    expect(screen.getByLabelText('Limitações Físicas')).toBeInTheDocument();
    expect(screen.getByLabelText('Preferências Alimentares')).toBeInTheDocument();
    expect(screen.getByLabelText('Tempo Disponível')).toBeInTheDocument();
  });

  it('should display user data in form fields', async () => {
    // Configurar o mock antes de renderizar
    mockUseUser.mockReturnValue({
      user: mockUser,
      updateUser: jest.fn(),
      clearData: jest.fn()
    });

    renderWithProviders(<EditUserForm onClose={mockOnClose} />);



    // Aguardar o componente ser renderizado completamente
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    });

    // Verificar se os campos estão preenchidos com os dados do usuário
    expect(screen.getByDisplayValue('25')).toBeInTheDocument();
    expect(screen.getByDisplayValue('70')).toBeInTheDocument();
    expect(screen.getByDisplayValue('170')).toBeInTheDocument();
    
    // Verificar se os selects estão funcionando corretamente
    const genderSelect = screen.getByRole('combobox', { name: 'Gênero' });
    const goalSelect = screen.getByRole('combobox', { name: 'Objetivo' });
    const activitySelect = screen.getByRole('combobox', { name: 'Nível de Atividade' });
    const locationSelect = screen.getByRole('combobox', { name: 'Local de Treino' });
    const bodySelect = screen.getByRole('combobox', { name: 'Tipo de Corpo Desejado' });
    const experienceSelect = screen.getByRole('combobox', { name: 'Nível de Experiência' });
    const dietarySelect = screen.getByRole('combobox', { name: 'Preferências Alimentares' });
    const timeSelect = screen.getByRole('combobox', { name: 'Tempo Disponível' });
    
    expect(genderSelect).toHaveValue('male');
    expect(goalSelect).toHaveValue('maintain');
    expect(activitySelect).toHaveValue('medium');
    expect(locationSelect).toHaveValue('home');
    expect(bodySelect).toHaveValue('toned');
    expect(experienceSelect).toHaveValue('beginner');
    expect(dietarySelect).toHaveValue('none');
    expect(timeSelect).toHaveValue('45min');
    
    expect(screen.getByDisplayValue('knee injury')).toBeInTheDocument();
  });

  it('should handle input changes correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditUserForm onClose={mockOnClose} />);

    const nameInput = screen.getByLabelText('Nome');
    const ageInput = screen.getByLabelText('Idade');
    const weightInput = screen.getByLabelText('Peso (kg)');

    await user.clear(nameInput);
    await user.type(nameInput, 'New Name');
    await user.clear(ageInput);
    await user.type(ageInput, '30');
    await user.clear(weightInput);
    await user.type(weightInput, '75');

    expect(nameInput).toHaveValue('New Name');
    expect(ageInput).toHaveValue(30);
    expect(weightInput).toHaveValue(75);
  });

  it('should handle select changes correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditUserForm onClose={mockOnClose} />);

    const genderSelect = screen.getByLabelText('Gênero');
    const goalSelect = screen.getByLabelText('Objetivo');

    await user.selectOptions(genderSelect, 'female');
    await user.selectOptions(goalSelect, 'lose');

    expect(genderSelect).toHaveValue('female');
    expect(goalSelect).toHaveValue('lose');
  });

  it('should handle physical limitations textarea correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditUserForm onClose={mockOnClose} />);

    const limitationsTextarea = screen.getByLabelText('Limitações Físicas');
    
    await user.clear(limitationsTextarea);
    await user.type(limitationsTextarea, 'back pain, shoulder injury');

    expect(limitationsTextarea).toHaveValue('back pain, shoulder injury');
  });

  it('should submit form successfully', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditUserForm onClose={mockOnClose} />);

    const submitButton = screen.getByText('Salvar Alterações');
    
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Dados atualizados com sucesso!');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should handle form submission with updated data', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditUserForm onClose={mockOnClose} />);

    // Modificar alguns campos
    const nameInput = screen.getByLabelText('Nome');
    const weightInput = screen.getByLabelText('Peso (kg)');
    
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');
    await user.clear(weightInput);
    await user.type(weightInput, '75');

    const submitButton = screen.getByText('Salvar Alterações');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Dados atualizados com sucesso!');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should show delete confirmation when delete button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditUserForm onClose={mockOnClose} />);

    const deleteButton = screen.getByText('Excluir Usuário');
    
    await user.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir seu usuário e todos os dados?');
  });

  it('should handle user deletion when confirmed', async () => {
    mockConfirm.mockReturnValue(true);
    const user = userEvent.setup();
    
    renderWithProviders(<EditUserForm onClose={mockOnClose} />);

    const deleteButton = screen.getByText('Excluir Usuário');
    
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Usuário excluído com sucesso!');
      expect(mockOnClose).toHaveBeenCalled();
    });

    // Verificar redirecionamento
    await waitFor(() => {
      expect(window.location.href).toBe('/');
    }, { timeout: 1000 });
  });

  it('should not delete user when deletion is cancelled', async () => {
    mockConfirm.mockReturnValue(false);
    const user = userEvent.setup();
    
    renderWithProviders(<EditUserForm onClose={mockOnClose} />);

    const deleteButton = screen.getByText('Excluir Usuário');
    
    await user.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockAlert).not.toHaveBeenCalledWith('Usuário excluído com sucesso!');
    expect(mockOnClose).not.toHaveBeenCalled();
  });



  it('should have proper form validation attributes', () => {
    renderWithProviders(<EditUserForm onClose={mockOnClose} />);

    const nameInput = screen.getByLabelText('Nome');
    const ageInput = screen.getByLabelText('Idade');
    const weightInput = screen.getByLabelText('Peso (kg)');
    const heightInput = screen.getByLabelText('Altura (cm)');

    expect(nameInput).toHaveAttribute('required');
    expect(ageInput).toHaveAttribute('required');
    expect(weightInput).toHaveAttribute('required');
    expect(heightInput).toHaveAttribute('required');
  });

  it('should have proper button types', () => {
    renderWithProviders(<EditUserForm onClose={mockOnClose} />);

    const submitButton = screen.getByText('Salvar Alterações');
    const deleteButton = screen.getByText('Excluir Usuário');

    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(deleteButton).toHaveAttribute('type', 'button');
  });
});
