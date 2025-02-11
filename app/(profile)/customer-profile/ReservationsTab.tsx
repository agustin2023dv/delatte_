import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Dimensions, Alert, TextInput } from 'react-native';
import { cancelReservationService, fetchUserReservationsService,
   modifyReservationService } from '@/services/reservation.service';
import { IReservation } from '@/shared/interfaces/IReservation';
import { validateFecha, validateHorario, 
  validateNumAdultos, validateNumNinos } from '@/shared/utils/reservation.validation';

const ReservationsTab = () => {
  const [futureReservations, setFutureReservations] = useState<IReservation[]>([]);
  const [pastReservations, setPastReservations] = useState<IReservation[]>([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [editingReservation, setEditingReservation] = useState<any | null>(null); // Reserva en edición

  const [showDatePicker, setShowDatePicker] = useState(false); // Estado para mostrar/ocultar el DatePicker
  const [selectedDate, setSelectedDate] = useState(new Date()); // Estado para la fecha seleccionada

  const screenWidth = Dimensions.get('window').width; // Ancho de la pantalla para ajustar el diseño
  const isWeb = screenWidth >= 800; 

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetchUserReservationsService();
  
        const reservations: IReservation[] = Array.isArray(response) ? response : [];
  
        if (reservations.length === 0) {
          console.log("No hay reservas disponibles");
          setFutureReservations([]);
          setPastReservations([]);
          return;
        }
  
        const currentDate = new Date();
  
        // Filtrar reservas futuras y pasadas basadas en la fecha
        const future = reservations.filter((reservation) => {
          const reservationDate = new Date(reservation.fecha);
          return reservationDate >= currentDate; // Futuras
        });
  
        const past = reservations.filter((reservation) => {
          const reservationDate = new Date(reservation.fecha);
          return reservationDate < currentDate; // Pasadas
        });
  
        setFutureReservations(future);
        setPastReservations(past);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
        Alert.alert("Error", "No se pudieron cargar las reservas");
      } finally {
        setLoading(false);
      }
    };
  
    fetchReservations();
  }, []);
  

  // Función para cancelar una reserva
  const handleCancelReservation = async (reservationId: string) => {
    try {
      await cancelReservationService(reservationId);
      Alert.alert('Cancelación exitosa', 'La reserva ha sido cancelada');

    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      Alert.alert('Error', 'No se pudo cancelar la reserva');
    }
  };

  // Función para modificar una reserva
  const handleModifyReservation = async (reservationId: string) => {
    try {
      // Validaciones locales antes de enviar los datos
      const fechaError = validateFecha(selectedDate.toISOString().split("T")[0]);
      const horarioError = validateHorario(editingReservation.horario);
      const adultosError = validateNumAdultos(editingReservation.numAdultos);
      const ninosError = validateNumNinos(editingReservation.numNinos);
  
      if (fechaError || horarioError || adultosError || ninosError) {
        Alert.alert(
          "Error en la modificación",
          `${fechaError || ""}\n${horarioError || ""}\n${adultosError || ""}\n${ninosError || ""}`.trim()
        );

        return;
      }
      if (!(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
        Alert.alert("Error", "La fecha seleccionada no es válida.");
        return;
      }
      
      const updatedData = {
        fecha: selectedDate, 
        horario: editingReservation.horario,
        numAdultos: editingReservation.numAdultos,
        numNinos: editingReservation.numNinos,
      };
  
      // Enviar datos al servicio
      await modifyReservationService(reservationId, updatedData);
  
      Alert.alert("Éxito", "Reserva modificada correctamente.");
      setEditingReservation(null); // Limpiar la edición
    } catch (error) {
      console.error("Error al modificar la reserva:", error);
      Alert.alert("Error", "No se pudo modificar la reserva.");
    }
  };

  // Función para habilitar la edición de una reserva
  const handleEditReservation = (reservation: any) => {
    setEditingReservation(reservation);
    setSelectedDate(new Date(reservation.dia)); // Configura la fecha seleccionada con la fecha de la reserva
  };

  // Función para manejar la selección de fecha en el DatePicker
  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setEditingReservation({ ...editingReservation, dia: selectedDate.toISOString().split('T')[0] });
    }
  };

  // Renderizado de cada reserva
  const renderReservationItem = ({ item }: { item: any }) => (
    <View style={styles.reservationItem}>
      {/* Si esta reserva está en edición, mostrar los inputs */}
      {editingReservation?._id === item._id ? (
        <>
          <Text>{`Fecha seleccionada: ${selectedDate.toDateString()}`}</Text>
          <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />

     
          <TextInput
            style={styles.input}
            value={editingReservation.horario}
            placeholder="Hora"
            onChangeText={text => setEditingReservation({ ...editingReservation, horario: text })}
          />
          <TextInput
            style={styles.input}
            value={String(editingReservation.numAdultos)}
            placeholder="Adultos"
            keyboardType="numeric"
            onChangeText={text => setEditingReservation({ ...editingReservation, numAdultos: parseInt(text) })} />
          <TextInput
            style={styles.input}
            value={String(editingReservation.numNinos)}
            placeholder="Niños"
            keyboardType="numeric"
            onChangeText={text => setEditingReservation({ ...editingReservation, numNinos: parseInt(text) })} />
          <Button title="Guardar Cambios" onPress={() => handleModifyReservation(item._id)} />
          <Button title="Cancelar Edición" onPress={() => setEditingReservation(null)} />
        </>
      ) : (
        <>
          <Text>{`Restaurante: ${item.restaurante}`}</Text>
          <Text>{`Fecha: ${new Date(item.dia).toLocaleDateString()}`}</Text>
          <Text>{`Hora: ${item.horario}`}</Text>
          <Text>{`Cantidad adultos: ${item.numAdultos}`}</Text>
          <Text>{`Cantidad niños: ${item.numNinos}`}</Text>

          {/* Mostrar botones de "Modificar" y "Cancelar" solo si la reserva es futura */}
          {item.estado === "Confirmada" && new Date(item.fecha) >= new Date() && (
            <>
              <Button title="Modificar" onPress={() => handleEditReservation(item)} />
              <Button title="Cancelar" onPress={() => handleCancelReservation(item._id)} />
            </>
          )}
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando reservas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={isWeb ? styles.webContainer : styles.mobileContainer}>

        <View style={styles.reservationColumn}>
          <Text style={styles.title}>Reservas Futuras</Text>
          <FlatList
            data={futureReservations}
            renderItem={renderReservationItem}
            ListEmptyComponent={<Text>No tienes reservas futuras.</Text>}
          />
        </View>

        <View style={styles.reservationColumn}>
          <Text style={styles.title}>Reservas Pasadas</Text>
          <FlatList
            data={pastReservations}
            renderItem={renderReservationItem}
            ListEmptyComponent={<Text>No tienes reservas pasadas.</Text>}
          />
        </View>


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7EBE1",
    padding: 20,
    alignItems: "center", 
  },
  webContainer: {
    flexDirection: "row",
    justifyContent: "center", 
    gap: 30, 
    width: "100%",
    maxWidth: 1200, 
  },
  mobileContainer: {
    flexDirection: "column",
    alignItems: "center", 
    width: "100%",
  },
  reservationColumn: {
    flex: 1,
    minWidth: 300, 
    maxWidth: 500, 
    backgroundColor: "#FFF8F2",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20, 
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6B4226",
    textAlign: "center",
    marginBottom: 15, 
  },
  reservationItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B4226",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: "#4A3B30",
    marginBottom: 3,
  },
  emptyText: {
    fontSize: 14,
    color: "#A58D7F",
    textAlign: "center",
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#A58D7F",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#6B4226",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});


export default ReservationsTab;
