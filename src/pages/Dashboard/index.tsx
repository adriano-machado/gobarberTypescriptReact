import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

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
            <span>Today</span>
            <span>Day 06</span>
            <span>SMonday</span>
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
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img
                  src="https://api.adorable.io/avatars/285/abott@adorable.png"
                  alt="teste"
                />
                <strong>Adriano Machado</strong>
              </div>
            </Appointment>
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img
                  src="https://api.adorable.io/avatars/285/abott@adorable.png"
                  alt="teste"
                />
                <strong>Adriano Machado</strong>
              </div>
            </Appointment>
          </Section>
          <Section>
            <strong>Afternoon</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img
                  src="https://api.adorable.io/avatars/285/abott@adorable.png"
                  alt="teste"
                />
                <strong>Adriano Machado</strong>
              </div>
            </Appointment>
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
