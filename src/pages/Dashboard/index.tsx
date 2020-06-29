import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, parseISO } from 'date-fns';
// import ptBR from 'date-fns/locale/pt-BR';
import { FiPower, FiClock } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../context/AuthContext';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Section,
  Appointment,
} from './styles';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}
interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}
const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    async function getMonthAvailability(): Promise<void> {
      try {
        const response = await api.get(
          `/providers/${user.id}/month-availability`,
          {
            params: {
              year: currentMonth.getFullYear(),
              month: currentMonth.getMonth() + 1,
            },
          },
        );
        setMonthAvailability(response.data);
        return;
      } catch (err) {
        console.log(err);
      }
    }
    getMonthAvailability();
  }, [currentMonth, user]);

  useEffect(() => {
    async function getAppointments(): Promise<void> {
      try {
        const response = await api.get<Appointment[]>(`/appointments/me`, {
          params: {
            year: currentMonth.getFullYear(),
            month: currentMonth.getMonth() + 1,
            day: selectedDate.getDate(),
          },
        });
        setAppointments(
          response.data.map(appointment => ({
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
          })),
        );
        return;
      } catch (err) {
        console.log(err);
      }
    }
    getAppointments();
  }, [selectedDate, user]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => !monthDay.available)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });
    return dates;
  }, [monthAvailability, currentMonth]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Day' dd 'of' MMMM");
  }, [selectedDate]);

  const selectedWeekday = useMemo(() => {
    return format(selectedDate, 'cccc');
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(
      appointment => parseISO(appointment.date).getHours() < 12,
    );
  }, [appointments]);
  const afternoonAppointments = useMemo(() => {
    return appointments.filter(
      appointment => parseISO(appointment.date).getHours() >= 12,
    );
  }, [appointments]);
  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img
              src={
                user.avatar_url ||
                'https://api.adorable.io/avatars/285/abott@adorable.png'
              }
              alt={user.name}
            />
            <div>
              <span>Welcome, </span>
              <strong>{user.name}</strong>
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Schedules</h1>
          <p>
            {isToday(selectedDate) && <span> Today</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekday}</span>
          </p>
          <NextAppointment>
            <strong>Next schedule</strong>
            <div>
              <img
                src="https://api.adorable.io/avatars/285/abott@adorable.png"
                alt="teste"
              />
              <strong>Adriano Machado</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Morning</strong>

            {morningAppointments.map(morningAppointment => (
              <Appointment key={morningAppointment.id}>
                <span>
                  <FiClock />
                  {morningAppointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={
                      morningAppointment.user.avatar_url ||
                      'https://api.adorable.io/avatars/285/abott@adorable.png'
                    }
                    alt={morningAppointment.user.name}
                  />
                  <strong>{morningAppointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Afternoon</strong>
            {afternoonAppointments.map(afternoonAppointment => (
              <Appointment key={afternoonAppointment.id}>
                <span>
                  <FiClock />
                  {afternoonAppointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={
                      afternoonAppointment.user.avatar_url ||
                      'https://api.adorable.io/avatars/285/abott@adorable.png'
                    }
                    alt={afternoonAppointment.user.name}
                  />
                  <strong>{afternoonAppointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            // weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            // months={[
            //   'Janeiro',
            //   'Fevereiro',
            //   'Março',
            //   'Abril',
            //   'Maio',
            //   'Junho',
            //   'Julho',
            //   'Agosto',
            //   'Setembro',
            //   'Outubro',
            //   'Novembro',
            //   'Dezembro',
            // ]}
            onMonthChange={handleMonthChange}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: {
                daysOfWeek: [1, 2, 3, 4, 5],
              },
            }}
            onDayClick={handleDateChange}
            selectedDays={selectedDate}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
