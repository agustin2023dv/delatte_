import React, { useState } from "react";
import { View, Text, Button, FlatList, TextInput, Alert, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";


interface Horario {
  dia: string;
  horaApertura: string;
  horaCierre: string;
}


interface HorariosManagerProps {
  horarios: Horario[];
  setHorarios: (horarios: Horario[]) => void;
}

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const HorariosManager: React.FC<HorariosManagerProps> = ({ horarios, setHorarios }) => {
  const [nuevoDia, setNuevoDia] = useState<string>(diasSemana[0]);
  const [horaApertura, setHoraApertura] = useState<string>("");
  const [horaCierre, setHoraCierre] = useState<string>("");

  const agregarHorario = () => {
    if (!horaApertura || !horaCierre) {
      Alert.alert("Error", "Debe ingresar ambas horas.");
      return;
    }

    // Verifica si ya existe un horario para el día seleccionado
    const diaExistente = horarios.find((horario) => horario.dia === nuevoDia);
    if (diaExistente) {
      Alert.alert("Error", "Ya existe un horario para este día.");
      return;
    }

    const nuevoHorario: Horario = { dia: nuevoDia, horaApertura, horaCierre };
    setHorarios([...horarios, nuevoHorario]);

    // Limpia los campos después de agregar
    setHoraApertura("");
    setHoraCierre("");
  };

  const eliminarHorario = (index: number) => {
    const nuevosHorarios = horarios.filter((_, i) => i !== index);
    setHorarios(nuevosHorarios);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕒 Horarios de Apertura</Text>

      <Picker
        selectedValue={nuevoDia}
        onValueChange={(itemValue: string) => setNuevoDia(itemValue)}
        style={styles.picker}
      >
        {diasSemana.map((dia) => (
          <Picker.Item key={dia} label={dia} value={dia} />
        ))}
      </Picker>

      <TextInput
        placeholder="Hora de Apertura (HH:MM)"
        value={horaApertura}
        onChangeText={setHoraApertura}
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Hora de Cierre (HH:MM)"
        value={horaCierre}
        onChangeText={setHoraCierre}
        style={styles.input}
        keyboardType="numeric"
      />

      <Button title="Agregar Horario" onPress={agregarHorario} />

      <FlatList
        data={horarios}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.horarioItem}>
            <Text style={styles.horarioText}>
              {`${item.dia}: ${item.horaApertura} - ${item.horaCierre}`}
            </Text>
            <Button title="❌" onPress={() => eliminarHorario(index)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 15 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 5,
  },
  horarioItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  horarioText: {
    fontSize: 16,
  },
});

export default HorariosManager;
